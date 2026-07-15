"""
Stripe helper — drop-in replacement for emergentintegrations Stripe checkout.
Used for Railway/production deployment where emergentintegrations is not available.
"""

import stripe
import os
import logging

logger = logging.getLogger(__name__)


def init_stripe():
    stripe.api_key = os.environ.get('STRIPE_API_KEY', '')


async def create_checkout(amount_cents, currency, success_url, cancel_url, metadata=None,
                          customer_email=None, collect_shipping=False, product_name=None):
    """Create a Stripe Checkout Session.
    Note: amount_cents may actually be in dollars (callers pass product prices
    like 29.00) — we convert to cents if the value looks like dollars (< 10000).
    """
    init_stripe()
    # Product configs store amounts in dollars (e.g., 29.00); Stripe needs cents (e.g., 2900).
    amount = int(amount_cents)
    if amount < 10000:  # Likely dollars, not cents
        amount = amount * 100
    try:
        resolved_name = (
            product_name
            or (metadata.get('service_name') if metadata else None)
            or 'GigLine Service'
        )
        session_kwargs = {
            'payment_method_types': ['card'],
            'line_items': [{
                'price_data': {
                    'currency': currency,
                    'product_data': {'name': resolved_name},
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            'mode': 'payment',
            'success_url': success_url,
            'cancel_url': cancel_url,
            'metadata': metadata or {},
        }
        if customer_email:
            session_kwargs['customer_email'] = customer_email
        if collect_shipping:
            session_kwargs['shipping_address_collection'] = {
                'allowed_countries': ['US'],
            }
            # Also capture phone number for shipping coordination
            session_kwargs['phone_number_collection'] = {'enabled': True}
            # Explicit $0 "Free USPS Priority Shipping" line so it shows on Stripe Checkout
            # (address collection alone would leave the shipping cost silent / ambiguous).
            session_kwargs['shipping_options'] = [{
                'shipping_rate_data': {
                    'type': 'fixed_amount',
                    'fixed_amount': {'amount': 0, 'currency': currency},
                    'display_name': 'Free USPS Priority Shipping',
                    'delivery_estimate': {
                        'minimum': {'unit': 'business_day', 'value': 2},
                        'maximum': {'unit': 'business_day', 'value': 5},
                    },
                },
            }]

        session = stripe.checkout.Session.create(**session_kwargs)
        return {
            'url': session.url,
            'session_id': session.id,
        }
    except Exception as e:
        logger.error(f"Stripe create_checkout error: {str(e)}")
        raise


async def get_checkout_status(session_id):
    """Get status of a checkout session."""
    init_stripe()
    try:
        # Stripe API removed `shipping_details` from the `expand` allow-list;
        # it's returned by default on completed sessions. `customer_details`
        # is also returned by default and doesn't need to be expanded.
        session = stripe.checkout.Session.retrieve(session_id)
        cd = session.customer_details
        sd = getattr(session, 'shipping_details', None)
        # `customer_details` and `shipping_details` are Stripe objects, not dicts —
        # use attribute access and coerce nested address to dict for downstream code.
        shipping_out = None
        if sd:
            addr = getattr(sd, 'address', None)
            shipping_out = {
                'name': getattr(sd, 'name', None),
                'address': dict(addr) if addr else None,
            }
        return {
            'status': session.status,
            'payment_status': session.payment_status,
            'amount_total': session.amount_total,
            'currency': session.currency,
            'metadata': dict(session.metadata) if session.metadata else {},
            'customer_email': getattr(cd, 'email', None) if cd else None,
            'customer_name': getattr(cd, 'name', None) if cd else None,
            'customer_phone': getattr(cd, 'phone', None) if cd else None,
            'shipping_details': shipping_out,
        }
    except Exception as e:
        logger.error(f"Stripe get_checkout_status error: {str(e)}")
        raise
