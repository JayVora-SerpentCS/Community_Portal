# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

import werkzeug
from odoo import http, SUPERUSER_ID
from odoo.http import request


class QueryURL(object):

    def __init__(self, path='', **args):
        self.path = path
        self.args = args

    def __call__(self, path=None, **kw):
        if not path:
            path = self.path
        for k, v in self.args.items():
            kw.setdefault(k, v)
        l = []
        for k, v in kw.items():
            if v:
                if isinstance(v, list) or isinstance(v, set):
                    l.append(werkzeug.url_encode([(k, i) for i in v]))
                else:
                    l.append(werkzeug.url_encode([(k, v)]))
        if l:
            path += '?' + '&'.join(l)
        return path


PPG = 12


class WebsitePartner(http.Controller):

    @http.route(['/partners',
                 '/partners/page/<int:page>'
                 ], type='http', auth="public", method=['post'],
                website=True, csrf=False)
    def partners(self, page=0, ppg=False, **post):
        """This method returns partners' grid view."""
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
        url = "/partners"
        partner_count = request.env['res.partner'].search_count(domain)
        pager = request.website.pager(url=url, total=partner_count, page=page,
                                      step=ppg, scope=7, url_args=post)
        partner = request.env['res.partner'].search(domain, limit=ppg,
                                                    offset=pager['offset'])
        return request.render("website_community_portal.partner_grid",
                              {'partners': partner,
                               'pager': pager,
                               })

    @http.route(['/filter_user'], type='json', auth='public', website=True,
                csrf=False)
    def filter_user(self, page=0, ppg=False, **kw):
        domain = []
        if kw.get('gender'):
            domain += [('gender', '=', kw.get('gender'))]
        domain += [('marital', '=', kw.get('marital')),
                   ('body_type', '=', kw.get('body_type')),
                   ('work_with', '=', kw.get('work_with')),
                   ('annual_income', '=', kw.get('annual_income')),
                   ('skin_tone', '=', kw.get('skin_tone'))]
        if ppg:
            try:
                ppg = int(ppg)
            except ValueError:
                ppg = PPG
            kw["ppg"] = ppg
        else:
            ppg = PPG
        url = "/partners"
        partner_count = request.env['res.partner'].search_count(domain)
        pager = request.website.pager(url=url, total=partner_count, page=page,
                                      step=ppg, scope=7)
        partner = request.env['res.partner'].search(domain, limit=ppg,
                                                    offset=pager['offset'])
        values = {'partners': partner,
                  'pager': pager,
                  }
        return request.env['ir.ui.view'
                           ].render_template('website_community_portal.' +
                                             'partner_grid', values)

    @http.route('/signup', type='http', auth="public", method=['post'],
                website=True, csrf=False)
    def signup(self, **post):
        """This method is useful to display DropDowns of
        cities, states & countries."""
        return request.render("website_community_portal.signup",
                              {'cities':
                               request.env['res.city'].sudo().search([]),
                               'states':
                               request.env['res.country.state'].
                               sudo().search([]),
                               'countries':
                               request.env['res.country'].sudo().search([])})

    @http.route(['/check_user'], type='json', auth='public', website=True,
                csrf=False)
    def check_user(self, **kw):
        """This method is used to create user after SignUp."""
        request.env['res.users'].sudo().\
            create({'name': kw.get('name'), 'login': kw.get('email'),
                    'email': kw.get('email'), 'password': kw.get('password'),
                    'gender': kw.get('gender') and kw.get('gender') or False,
                    'dob': kw.get('dob'), 'mobile': kw.get('mob_no'),
                    'city': request.env['res.city'].sudo().
                    search([('id', '=', kw.get('city'))]).name,
                    'state_id': kw.get('state'),
                    'country_id': kw.get('country')})
        return True

    @http.route('/partners/<model("res.partner"):partner>', type='http',
                auth="public", website=True, csrf=False)
    def get_partner_account_details(self, partner, **kw):
        """This method returns member's account details"""
        uid = request.uid
        admin_access = False
        if uid == SUPERUSER_ID or uid == request.env.uid:
            admin_access = True
        return request.render("website_community_portal.partner_account",
                              {'partner': partner,
                               'admin_access': admin_access})

    @http.route(['/edit_partner/<model("res.partner"):partner>'], type='http',
                method=['post'], auth='user', website=True, csrf=False)
    def edit_partner(self, partner, redirect=None, **post):
        """An Administrator who has access rights can edit any member's
        details."""
        user_as_a_partner = \
            request.env['res.users'].sudo().browse(request.uid).partner_id

        is_user = False
        if partner.id == user_as_a_partner.id:
            is_user = True
        if post:
            post.update({'have_children': post.get('children'),
                         'zip': post.get('zip'),
                         'height': post.get('partner_height'),
                         'state_id': post.get('state'),
                         'country_id': post.get('country'),
                         'dob': post.get('dob')})
            partner.sudo().write(post)
            return request.redirect('/partners')
        countries = request.env['res.country'].sudo().search([])
        states = request.env['res.country.state'].sudo().search([])
        educations = request.env['education.field'].sudo().search([])
        heights = request.env['partner.height'].sudo().search([])
        cities = request.env['res.city'].sudo().search([])
        community = request.env['community.community'].sudo().search([])
        sub_community = request.env['sub.community'].sudo().search([])
        mother_tongue = request.env['mother.tongue'].sudo().search([])
        can_speak = request.env['language.language'].sudo().search([])
        portal_user = request.env['res.partner'].sudo().search([])
        gotra = request.env['gotra.gotra'].sudo().search([])
        tags = request.env['res.partner.category'].sudo().search([])
        selected_tags = partner.category_id
        values = {'portal_user': portal_user,
                  'is_user': is_user,
                  'mother_tongue': mother_tongue,
                  'sub_community': sub_community,
                  'community': community,
                  'cities': cities,
                  'partner': partner,
                  'countries': countries,
                  'states': states,
                  'educations': educations,
                  'heights': heights,
                  'can_speak': can_speak,
                  'gotra': gotra,
                  'selected_tags': selected_tags,
                  'category_id': tags,
                  'has_check_vat': hasattr(request.env['res.partner'],
                                           'check_vat')}
        return request.render('website_portal.details', values)

    @http.route(['/family_tree'], type='json', auth='public', website=True,
                csrf=False)
    def family_tree(self, **kw):
        partner_dic = {}
        partner = \
            request.env['res.partner'].sudo().browse(kw.get('partner_id'))
        partner_dic = \
            {'name': partner.name and partner.name.capitalize() or '',
             'id': partner.id,
             'image': partner.image,
             'gender': partner.gender and partner.gender.capitalize() or '',
             'age': partner.age,
             }
        partner_dic.update(self.get_spouse(partner))
        partner_dic.update(self.get_siblings(partner))
        partner_dic.update(self.get_parent(partner))
        partner_dic.update(self.get_children(partner))
        return partner_dic

    def get_spouse(self, parent):
        spouse_list = []
        spouse = parent.spouse_id
        if spouse:
            spouse_dic = \
                {'name': spouse.name and spouse.name.capitalize() or '',
                 'id': spouse.id,
                 'image': spouse.image,
                 'gender': spouse.gender and spouse.gender.capitalize() or '',
                 'age': spouse.age,
                 }
            spouse_list.append(spouse_dic)
        if spouse_list:
            return {'_spouse': spouse_list}
        return {}

    def get_siblings(self, parent):
        sibling_list = []
        for sibling in parent.sibling_ids:
            sibling_dic = \
                {'name': sibling.name and sibling.name.capitalize() or '',
                 'id': sibling.id,
                 'gender':
                 sibling.gender and sibling.gender.capitalize() or '',
                 'age': sibling.age,
                 'image': sibling.image,
                 }
            sibling_list.append(sibling_dic)
        if sibling_list:
            return {'_siblings': sibling_list}
        return {}

    def get_children(self, parent):
        child_list = []
        for child in parent.children_ids:
            child_dic = {'name': child.name and child.name.capitalize() or '',
                         'id': child.id,
                         'gender':
                         child.gender and child.gender.capitalize() or '',
                         'age': child.age,
                         'image': child.image,
                         }
            child_dic.update(self.get_spouse(child))
            child_dic.update(self.get_children(child))
            child_list.append(child_dic)
        if child_list:
            return {'_children': child_list}
        return {}

    def get_parent(self, parent):
        parents_list = []
        father_dic = mother_dic = {}
        father = parent.father_id
        if father:
            father_dic = \
                {'name': father.name and father.name.capitalize() or '',
                 'id': father.id,
                 'image': father.image,
                 'gender': father.gender and father.gender.capitalize() or '',
                 'age': father.age,
                 }
            father_dic.update(self.get_parent(father))
            parents_list.append(father_dic)
        mother = parent.mother_id
        if mother:
            mother_dic = \
                {'name': mother.name and mother.name.capitalize() or '',
                 'id': mother.id,
                 'image': mother.image,
                 'gender': mother.gender and mother.gender.capitalize() or '',
                 'age': mother.age
                 }
            mother_dic.update(self.get_parent(mother))
            parents_list.append(mother_dic)
        if parents_list:
            return {'_parents': parents_list}
        return {}

#    @http.route(['/children_tree'], type='json', auth='public', website=True,
#                csrf=False)
#    def children_tree(self, **kw):
#        partner_dic = {}
#        partner = request.env['res.partner'].sudo().browse(
#                                           kw.get('partner_id'))
#        partner_dic = {'personFullName': partner.name.capitalize() or '',
#                       'personId': partner.id,
#                       'image': partner.image,
#                       'personGenderId': partner.gender,
#                       'age': partner.age,
#                       }
#        if (partner_dic('personGenderId') == 'male'):
#            partner_dic.update({'personGenderId': 0})
#        partner_dic.update(self.get_spouse(partner))
#        partner_dic.update(self.get_parent(partner))
#        partner_dic.update(self.get_children(partner))
#        return partner_dic
