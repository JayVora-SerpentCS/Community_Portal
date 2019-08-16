# See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class Rating(models.Model):

    _inherit = 'rating.rating'

    website_published = fields.Boolean(
        related='message_id.website_published',
        store=True
    )
