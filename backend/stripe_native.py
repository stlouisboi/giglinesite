"""
Stripe helper — drop-in replacement for emergentintegrations Stripe checkout.
Used for Railway/production deployment where emergentintegrations is not available.

Usage: Set USE_NATIVE_STRIPE=true in .env to use this instead of emergentintegrations.
"""

import stripe
import os


def init_stripe():
    stripe.api_key = os.environ.get('STRIPE_API_KEY', '')


async def create_checkout(amount_cents, currency, success_url, cancel_url, metadata=None):
    """Create a Stripe Checkout Session. Returns dict with 'url' and 'session_id'."""
    init_stripe()
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': currency,
                'product_data': {
                    'name': metadata.get('service_name', 'GigLine Service') if metadata else 'GigLine Service',
                },
                'unit_amount': amount_cents,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata or {},
    )
    return {
        'url': session.url,
        'session_id': session.id,
    }


async def get_checkout_status(session_id):
    """Get status of a checkout session. Returns dict with status fields."""
    init_stripe()
    session = stripe.checkout.Session.retrieve(session_id)
    return {
        'status': session.status,
        'payment_status': session.payment_status,
        'amount_total': session.amount_total,
        'currency': session.currency,
        'metadata': dict(session.metadata) if session.metadata else {},
    }
