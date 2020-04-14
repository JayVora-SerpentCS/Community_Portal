# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class ResPartner(models.Model):
    _inherit = 'res.partner'

    business_detail_ids = fields.One2many('business.diary', 'name',
                                          string='Business Details')
