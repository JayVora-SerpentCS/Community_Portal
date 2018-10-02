# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request


class WebsiteBlogs(http.Controller):

    @http.route(['/get_blogs_data'], type='json', auth="public", website=True,
                csrf=False)
    def get_blogs_data(self, **kwargs):
        if not kwargs.get('template_render'):
            data = request.website.get_website_blog_config()
            return data
        else:
            return request.env.ref("website_blog_configurator."
                                   "our_blogs").render()
