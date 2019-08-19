# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request
from odoo.addons.website_mail.controllers.main import WebsiteMail


class WebsiteMailController(WebsiteMail):

    @http.route(['/website_mail/post/json'], type='json', auth='public',
                website=True)
    def chatter_json(self, res_model='', res_id=None, message='', **kw):
        params = kw.copy()
        params.pop('rating', False)
        message_data = super(WebsiteMailController, self).\
            chatter_json(res_model=res_model, res_id=res_id,
                         message=message, **params)
        if message_data and kw.get('rating') and res_model == 'event.event':
            rating = request.env['rating.rating'].create({
                'rating': float(kw.get('rating')),
                'res_model': res_model,
                'res_id': res_id,
                'message_id': message_data['id'],
                'consumed': True,
            })
            message_data.update({
                'rating_default_value': rating.rating,
                'rating_disabled': True,
            })
        return message_data
