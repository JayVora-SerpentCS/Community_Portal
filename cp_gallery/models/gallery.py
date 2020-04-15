# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class Gallery(models.Model):
    _name = 'gallery.photos'
    _description = 'Stores community photos'

    gallery_id = fields.Many2one('gallery.gallery', 'Gallery')
    images = fields.Binary(string='Photos')
