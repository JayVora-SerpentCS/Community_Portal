# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class Designations(models.Model):
    _name = 'designations'
    _description = 'Designations'
    _rec_name = 'name'

    name = fields.Char('Designation Name')
    code = fields.Char('Designation Code')
