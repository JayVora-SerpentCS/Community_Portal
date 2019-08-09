# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request

PPG = 12


class WebsiteBusinessDiary(http.Controller):
    @http.route(['/page/business_diary',
                 '/page/business_diary/page/<int:page>',
                 ], type='http', auth="public", method=['post'],
                website=True, csrf=False)
    def business_diary(self, page=0, ppg=False, **post):
        vals = {}
        if ppg:
            try:
                ppg = int(ppg)
            except ValueError:
                ppg = PPG
            post["ppg"] = ppg
        else:
            ppg = PPG

        domain = [('business_detail_ids.show_to_diary', '=', True)]
        if post.get('srch-term'):
            domain = [
                ('name', 'ilike', post.get('srch-term')),
                ('business_detail_ids.name', '=', False)
            ]
        url = '/page/business_diary'
        business_diary_count = request.env['res.partner'].search_count(domain)
        pager = request.website.pager(
            url=url, total=business_diary_count, page=page, step=ppg, scope=7,
            url_args=post
        )
        business_diary = request.env['res.partner'].search(
            domain, limit=ppg, offset=pager['offset']
        )
        vals = {
            'business_info': business_diary,
            'pager': pager
        }
        return request.render('cp_businessdiary.business_diary', vals)

    @http.route('/business_diary/<model("res.partner"):partner>',
                type='http', auth="public", website=True, csrf=False)
    def get_partner_account_details(self, partner, **kw):
        flag = 0
        main_prof = partner.business_detail_ids
        for business_detail_id in partner.business_detail_ids:
            if flag == 0:
                main_prof = business_detail_id
                flag = 1
        vals = {
            'partner': partner,
            'main_profession': main_prof
        }
        return request.render("cp_businessdiary.business_diary_1", vals)

    @http.route('/business_diary/add_details',
                type='http',
                auth="public", website=True, csrf=False)
    def add_business_details(self, **kw):
        user_id = request.env['res.users'].browse(request.env.user.id)
        res_partner = request.env['res.partner'].search(
            [('name', '=', user_id.name)]
        )
        state = request.env['res.country.state'].search([])
        country = request.env['res.country'].search([])
        city = request.env['res.city'].search([])
        designations = request.env['designations'].search([])
        vals = {
            'partner': res_partner,
            'state': state,
            'country': country,
            'city': city,
            'designations': designations
        }
        return request.render("cp_businessdiary.input_business", vals)

    @http.route('/business_diary/insert', type='http', auth="public",
                website=True, csrf=False)
    def insert_business_diary(self, ppg=False, page=0, **post):
        if ppg:
            try:
                ppg = int(ppg)
            except ValueError:
                ppg = PPG
            post["ppg"] = ppg
        else:
            ppg = PPG
        domain = []
        if post.get('srch-term'):
            domain = [('name', 'ilike', post.get('srch-term'))]
        url = '/page/business_diary'
        business_diary_count = request.env['res.partner'].search_count(domain)
        pager = request.website.pager(
            url=url, total=business_diary_count, page=page, step=ppg, scope=7,
            url_args=post
        )
        business_diary = request.env['res.partner'].search(
            domain, limit=ppg, offset=pager['offset']
        )
        lst = []
        user_id = request.env['res.users'].browse(request.env.user.id)
        res_partner = request.env['res.partner'].search(
            [('name', '=', user_id.name)]
        )
        lst.append((0, 0, {
            'name': res_partner.id,
            'profession': post.get('txtprofession'),
            'designation_id': post.get('desig'),
            'street': post.get('txtstreet'),
            'street2': post.get('txtstreet2'),
            'city': post.get('city'),
            'state_id': post.get('state'),
            'country_id': post.get('country'),
            'zip': post.get('txtzip'),
            'phone': post.get('txtphone'),
            'mobile': post.get('txtmobile'),
            'organization': post.get('txtorg')
        }))
        res_partner.business_detail_ids = lst
        vals = {
            'business_info': business_diary,
            'pager': pager
        }
        return request.render('cp_businessdiary.business_diary', vals)
