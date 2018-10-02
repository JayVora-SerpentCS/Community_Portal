# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

COLOR = [('red', 'Red'), ('blue', 'Blue'), ('black', 'Black'),
         ('white', 'White'), ('yellow', 'Yellow'), ('green', 'Green'),
         ('pink', 'Pink'), ('brown', 'Brown'), ('gray', 'Gray'),
         ('maroon', 'Maroon')]
POSITION = [('top', 'Top'), ('bottom', 'Bottom')]


class Website(models.Model):
    _inherit = "website"

    date_start = fields.Datetime('From Date', required=True)
    date_end = fields.Datetime('To Date', required=True)
    blog_display_website = fields.Boolean('Display On Website', default=True)
    is_active = fields.Boolean('Active', default=True)
    back_color = fields.Selection(COLOR, 'Background Color', required=True,
                                  default='white')
    font_color = fields.Selection(COLOR, 'Font Color', required=True,
                                  default='black')
    display_blog_on = fields.Many2one('website.menu', 'Display On',
                                      required=True)
    blog_display_position = fields.Selection(POSITION,
                                             'Position to Display on Page',
                                             required=True)
    bg_image = fields.Binary("Background Image")

    @api.multi
    def get_blogs(self):
        blogs = []
        if self.blog_display_website and self.is_active:
            blogs = self.env['blog.post'].\
                search([('write_date', '>=', self.date_start),
                        ('write_date', '<=', self.date_end)])
        return blogs

    @api.multi
    def get_website_blog_config(self):
        data = {}
        if self.blog_display_website and self.is_active and\
                self.display_blog_on:
            data.update({'display_blog_on':
                         self.display_blog_on.url.encode("ascii"),
                         'blog_display_position': self.blog_display_position,
                         'back_color': self.back_color,
                         'font_color': self.font_color,
                         'bg_image': self.bg_image,
                         })
        return data


class WebsiteBlogConfigurator(models.TransientModel):

    _name = 'website.blog.configurator'
    _inherit = 'res.config.settings'

    website_id = fields.\
        Many2one('website', "Website",
                 default=lambda self: self.env['website'].search([])[0])
    date_start = fields.Datetime('From Date', related='website_id.date_start',
                                 required=True)
    date_end = fields.Datetime('To Date', related='website_id.date_end',
                               required=True)
    blog_display_website = fields.\
        Boolean('Display On Website',
                related='website_id.blog_display_website')
    is_active = fields.Boolean('Active', related='website_id.is_active')
    back_color = fields.Selection(COLOR, 'Background Color', required=True,
                                  related='website_id.back_color')
    font_color = fields.Selection(COLOR, 'Font Color', required=True,
                                  related='website_id.font_color')
    display_blog_on = fields.Many2one('website.menu', 'Display On',
                                      related='website_id.display_blog_on',
                                      required=True)
    blog_display_position = fields.\
        Selection(POSITION, 'Position to Display on Page',
                  related='website_id.blog_display_position',
                  required=True)
    bg_image = fields.Binary('Background Image',
                             related='website_id.bg_image')
