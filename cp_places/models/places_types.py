# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class PlacesType(models.Model):
    _name = 'places.type'

    name = fields.Char(string='Place Type')
