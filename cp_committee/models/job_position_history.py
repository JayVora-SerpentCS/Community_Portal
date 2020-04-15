# See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api


class JobPositionHistory(models.Model):
    _name = 'jobpos.history'

    before = fields.Char(string='Old Member')
    before_date = fields.Date(string='Date')
    after = fields.Char(string='New Member')
    after_date = fields.Date(string='Date')
    position_id = fields.Many2one('job.position',
                                  string='Job Positions')

    @api.model
    def create(self, vals):
        po_id = self.env['job.position'].browse(vals['position_id'])
        po_id.responsible_person_id.committee_position = po_id
        return super(JobPositionHistory, self).create(vals)
