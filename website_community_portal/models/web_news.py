# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

import datetime
from odoo import api, fields, models

COLOR = [('red', 'Red'), ('blue', 'Blue'), ('black', 'Black'),
         ('white', 'White'), ('yellow', 'Yellow'), ('green', 'Green'),
         ('pink', 'Pink'), ('brown', 'Brown'), ('gray', 'Gray'),
         ('maroon', 'Maroon')]


class WebNews(models.Model):
    _name = 'web.news'
    _rec_name = 'date_time'

    date_time = fields.Datetime(string='Date-Time', required=True)
    description = fields.Text(string='Description', required=True)
    is_active = fields.Boolean(string='Active', default=True)
    back_color = fields.Selection(
        COLOR,
        string='Background Color',
        required=True,
        default='white'
    )
    font_color = fields.Selection(
        COLOR,
        string='Font Color',
        required=True,
        default='black'
    )

    @api.model
    def get_active_news(self):
        news_ids = self.search(
            [('is_active', '=', True),
             ('date_time', '<=', datetime.now().strftime("%Y-%m-%d %H:%M:59"))]
        )
        return self.read(news_ids)
