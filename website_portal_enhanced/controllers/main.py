# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request
from odoo.addons.website_portal.controllers.main import website_account


class Account(website_account):

    @http.route(['/my/account'], type='http', auth='user', method=['post'],
                website=True, csrf=False)
    def details(self, redirect=None, **post):
        """This method searches related user as a partner &
        returns the portal details record of that partner
        in user account view."""
        partner = request.env['res.users'].browse(request.uid).partner_id
        if post:
            post.update({'have_children': post.get('children'),
                         'zip': post.get('zip'),
                         'height': post.get('partner_height'),
                         'state_id': post.get('state'),
                         'country_id': post.get('country'),
                         'dob': post.get('dob')})
            partner.sudo().write(post)
            return request.redirect('/my/home')
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
                  'is_user': True,
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
                                           'check_vat'),
                  'redirect': redirect}
        return request.render('website_portal.details', values)

#    @http.route(['/lang_speak'], type='json', auth='public', website=True,
#                csrf=False)
#    def lang_speak(self, **kw):
#        partner = request.env['res.users'].browse(request.uid).partner_id
#        lang_ids = map(int, kw.get('can_speak'))
#        partner.sudo().write({'can_speak': [(6, 0, lang_ids)]})
        return True

    @http.route(['/tags'], type='json', auth='public', website=True,
                csrf=False)
    def tags(self, **kw):
        partner = request.env['res.partner'].\
            browse(int(kw.get('selected_partner')))
        tags_ids = map(int, kw.get('tags'))
        partner.sudo().write({'category_id': [(6, 0, tags_ids)]})
        return True

    def details_form_validate(self, data):
        error = dict()
        error_message = []
        return error, error_message

    @http.route(['/my', '/my/home'], type='http', auth='public', website=True,
                csrf=False)
    def account(self):
        """This method returns The detailed portal view of the user
        in My Account page."""
        partner = request.env.user.partner_id
        # get customer sales rep
        if partner.user_id:
            sales_rep = partner.user_id
        else:
            sales_rep = False
        # calculate percentages of profile completed
        fields_list = []
        if partner.name:
            fields_list.append(partner.name)
        if partner.email:
            fields_list.append(partner.email)
        if partner.mobile:
            fields_list.append(partner.mobile)
        if partner.education:
            fields_list.append(partner.education)
        if partner.gender:
            fields_list.append(partner.gender)
        if partner.image:
            fields_list.append(partner.image)
        if partner.marital:
            fields_list.append(partner.marital)
        if partner.dob:
            fields_list.append(partner.dob)
        if partner.city:
            fields_list.append(partner.city)
        if partner.state_id:
            fields_list.append(partner.state_id)
        if partner.category_id:
            fields_list.append(partner.category_id)
        percentage = "{0:.0f}%".format(len(fields_list) * 10)
        values = {'percentage': percentage,
                  'style': 'width:' + str(percentage) + ';color:white;'
                  'font-weight:bold; background-color: yellowgreen;',
                  'partner': partner,
                  'sales_rep': sales_rep,
                  'company': request.website.company_id,
                  'user': request.env.user}
        return request.render('website_portal.account', values)
