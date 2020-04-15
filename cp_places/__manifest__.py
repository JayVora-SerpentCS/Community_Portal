# See LICENSE file for full copyright and licensing details.

{
    'name': 'Places For Community Portal',
    'category': 'website',
    'summary': 'Place management',
    'version': '12.0.1.0.5',
    'license': 'LGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'website_community_portal',
        'web_google_maps'
    ],
    'data': [
        'security/portal_security.xml',
        'security/ir.model.access.csv',
        'data/website_menu.xml',
        'views/assets.xml',
        'views/template_place_detail.xml',
        'views/place_view.xml',
        'views/template_place.xml',
        'views/template_select_place.xml',
        'views/template_insert_place.xml',
        'report/report_regi.xml',
        'report/filter_place.xml'
    ],
    'installable': True,
    'application': True,
}
