# See LICENSE file for full copyright and licensing details.

from odoo import models, fields


class GalleryPhotos(models.Model):
    _name = 'gallery.gallery'
    _description = 'Stores community photos'
    _rec_name = 'event_id'

    event_id = fields.Many2one('event.event', 'Event', required=True)
    photo_ids = fields.One2many('gallery.photos', 'gallery_id',
                                'Photos')
