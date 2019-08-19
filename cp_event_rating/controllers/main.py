# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request


class WebsiteEventController(http.Controller):

    @http.route(['/event/<model("event.event"):event>/register'],
                type='http', auth="public", website=True)
    def event_register(self, event, **post):
        Rating = request.env['rating.rating']
        ratings = Rating.search([('message_id', 'in',
                                  event.website_message_ids.ids)])
        rating_message_values = dict([(record.message_id.id, record.rating
                                       ) for record in ratings])
        rating_product =\
            event.rating_get_stats([('website_published', '=', True)])

        is_installed_module = True
        module_dic = request.env['ir.module.module']._installed()
        installed_module = module_dic.get('website_sale')
        if installed_module:
            is_installed_module = False

        values = {
            'event': event,
            'main_object': event,
            'range': range,
            'registrable': event.sudo()._is_event_registrable(),
            'rating_message_values': rating_message_values,
            'rating_product': rating_product,
            'is_event': is_installed_module,
        }
        return request.render("website_event.event_description_full", values)
