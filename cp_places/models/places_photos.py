# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class PlacesPhotos(models.Model):
    _name = 'places.photos'

    name = fields.Binary(string="Add image")
    place_id = fields.Many2one('places.place', string='Place')
