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
    Note: amount_cents may actually be in dollars from SERVICE_PACKAGES — 
    we convert to cents if value looks like dollars (< 10000).
    """
    init_stripe()
    # SERVICE_PACKAGES stores amounts in dollars (e.g., 650.00)
    # Stripe needs cents (e.g., 65000)
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
        session = stripe.checkout.Session.retrieve(
            session_id,
            expand=['customer_details', 'shipping_details'],
        )
        return {
            'status': session.status,
            'payment_status': session.payment_status,
            'amount_total': session.amount_total,
            'currency': session.currency,
            'metadata': dict(session.metadata) if session.metadata else {},
            'customer_email': (session.customer_details or {}).get('email') if session.customer_details else None,
            'customer_name': (session.customer_details or {}).get('name') if session.customer_details else None,
            'customer_phone': (session.customer_details or {}).get('phone') if session.customer_details else None,
            'shipping_details': (
                dict(session.shipping_details) if getattr(session, 'shipping_details', None) else None
            ),
        }
    except Exception as e:
        logger.error(f"Stripe get_checkout_status error: {str(e)}")
        raise
