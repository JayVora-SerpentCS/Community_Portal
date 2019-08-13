# See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class Event(models.Model):
    _inherit = ['event.event', 'website.seo.metadata',
                'website.published.mixin', 'rating.mixin']
    _name = 'event.event'
    _mail_post_access = 'read'

    website_message_ids = fields.One2many(
        'mail.message', 'res_id',
        domain=lambda self: ['&', ('model', '=', self._name),
                             ('message_type', '=', 'comment')],
        string='Website Comments',
    )
