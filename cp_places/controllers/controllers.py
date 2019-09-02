# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request


class WebsitePlaces(http.Controller):
    @http.route(['/page/place'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_place_page(self, page=0, ppg=False, **post):
        place_details = request.env['places.place'].\
            search([('place_name', '=', post.get('id'))])
        vals = {
            'record': place_details
        }
        return request.render('cp_places.template_place', vals)

    @http.route(['/page/place_select'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_place_page_select(self, page=0, ppg=False, **post):
        place_details = request.env['places.place'].search([])
        state = request.env['res.country.state'].search([])
        place_types = request.env['places.type'].search([])
        vals = {
            'place_types': place_types,
            'state': state,
            'record': place_details
        }
        return request.render('cp_places.template_select_place', vals)

    @http.route(['/page/place_detail/'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_place_details(self, page=0, ppg=False, **post):
        place_data = request.env['places.place'].search(
            [('place_name', '=', post.get('id'))])
        vals = {
            'record': place_data
        }
        return request.render('cp_places.template_place_detail', vals)

    @http.route(['/page/show_map/'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_map_details(self, page=0, ppg=False, **post):
        place_data = request.env['places.place'].search(
            [('place_name', '=', post.get('id'))])
        vals = {
            'record': place_data
        }
        return request.render('cp_places.template_place', vals)

    @http.route(['/page/test/'], type='json', auth="public",
                website=True, csrf=False)
    def show_test(self, page=0, ppg=False, **post):
        place_details = request.env['places.place'].search(
            [('place_name', '=', post.get('pname'))])
        loc_list = [place_details.place_name, place_details.partner_latitude,
                    place_details.partner_longitude]
        return loc_list

    @http.route(['/page/filter/'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_filtered_data(self, page=0, ppg=False, **post):
        place_details = request.env['places.place'].search(
            [('state_id', '=', post.get('state')),
             ('place_type_id', '=', post.get('ptype'))
             ])
        state = request.env['res.country.state'].search([])
        place_types = request.env['places.type'].search([])
        vals = {
            'record': place_details,
            'place_types': place_types,
            'state': state
        }
        return request.render('cp_places.template_select_place', vals)

    @http.route(['/page/insert_place/'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_insert_page(self, page=0, ppg=False, **post):
        return request.render('cp_places.template_insert_place')
