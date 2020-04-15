# See LICENSE file for full copyright and licensing details.

import datetime
import json
from odoo import models, fields, api
from lxml import etree


class JobPosition(models.Model):
    _name = 'job.position'
    _description = 'Stores Job Position'

    sequence = fields.Integer('Job sequence')
    name = fields.Char(string='Job Position', required=True)
    responsible_person_id = fields.Many2one('res.partner',
                                            string='Responsible Person',
                                            required=True)
    job_pos_hist_ids = fields.One2many('jobpos.history', 'position_id',
                                       'Job Position History')
    manager_id = fields.Many2one('res.partner', 'Manager')

    @api.model
    def create(self, vals):
        vals['sequence'] = self.env['ir.sequence'].next_by_code('code')
        rec_partner_new = self.env['res.partner'
                                   ].browse(vals.get('responsible_person_id'))
        vals['job_pos_hist_ids'] = [(0, 0, {
            'before': self.env.user and self.env.user.partner_id and
            self.env.user.partner_id.name or False,
            'before_date': datetime.datetime.now().date(),
            'after': rec_partner_new.name,
            'after_date': datetime.datetime.now().date()
        })]
        return super(JobPosition, self).create(vals)

    @api.multi
    def write(self, vals):
        list_history_data = []
        responsible_person = vals.get('responsible_person_id')
        if responsible_person:
            self.responsible_person_id.committee_position = None
            rec_partner_new = self.env['res.partner'
                                       ].browse(responsible_person)
            rec_partner_new.committee_position = self.id
            list_history_data.append(
                (0, 0, {'before': self.responsible_person_id.name,
                        'before_date': datetime.datetime.now().date(),
                        'after': rec_partner_new.name,
                        'after_date': datetime.datetime.now().date()}))
            self.job_pos_hist_ids = list_history_data
        return super(JobPosition, self).write(vals)

    @api.multi
    @api.onchange('responsible_person_id')
    def onchange_manager_data(self):
        res = {}
        job_results = self.env['res.partner'
                               ].search([('committee_position', '!=', None)])
        res['domain'] = {
            'manager_id': [('id', '=', job_results.ids)],
            'responsible_person_id': [('committee_position', '=', None)]
        }
        return res

    @api.model
    def fields_view_get(self, view_id=None, view_type='form',
                        toolbar=False, submenu=False):
        res = super(JobPosition, self).fields_view_get(
            view_id=view_id, view_type=view_type, toolbar=toolbar,
            submenu=submenu)
        doc = etree.XML(res['arch'])
        for node in doc.xpath("//field[@name='manager_id']"):
            job_ids = self.search([])
            if job_ids:
                node.set('required', "1")
                modifiers = json.loads(node.get("modifiers"))
                modifiers['required'] = True
                node.set("modifiers", json.dumps(modifiers))
        res['arch'] = etree.tostring(doc)
        return res
