# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class ResPartner(models.Model):
    _inherit = 'res.partner'

    committee_position = fields.Many2one('job.position',
                                         'Committee position')
