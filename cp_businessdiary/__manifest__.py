# See LICENSE file for full copyright and licensing details.

{
    'name': 'Business Diary For Community Portal',
    'category': 'Website',
    'summary': 'Business Diary Management',
    'version': '11.0.1.0.0',
    'license': 'AGPL-3',
    'website': 'http://www.serpentcs.com',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'depends': [
        'website_community_portal',
    ],
    'data': [
        'security/portal_security.xml',
        'security/ir.model.access.csv',
        'data/website_menu.xml',
        'views/templates.xml',
        'views/template_input_business.xml',
        'views/view_business_diary.xml',
        'views/user_actions.xml',
        'views/view_res_partner.xml',
    ],
    'installable': True,
    'application': True,
}
