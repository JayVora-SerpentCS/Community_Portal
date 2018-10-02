# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Community Portal',
    'version': '10.0.1.0.0',
    'category': 'Website',
    'license': 'AGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'summary': ''' Website Matrimonial odoo.''',
    'depends': [
        'website',
        'sales_team',
        'website_menu_by_user_status',
        'website_blog_configurator',
        'website_portal_enhanced',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/res_country_state_data.xml',
        'data/res_city_data.xml',
        'data/education_data.xml',
        'data/height_data.xml',
        'views/master_view.xml',
        'views/res_city_view.xml',
        'views/res_partner_view.xml',
        'views/web_news.xml',
        'views/assets.xml',
        'views/account_details_view.xml',
        'views/templates.xml',
        'views/menu_details.xml',
    ],
    'qweb': ['static/src/xml/website_ace_inherited.xml'],
    'installable': True,
    'application': True,
}
