# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class ResCity(models.Model):
    _name = "res.city"

    name = fields.Char(
        string='City Name',
        required=True
    )
    state_id = fields.Many2one(
        'res.country.state',
        string='State',
        required=True
    )
    country_id = fields.Char(
        related='state_id.country_id.name',
        string='Country'
    )
