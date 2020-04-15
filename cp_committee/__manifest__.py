# See LICENSE file for full copyright and licensing details.

{
    'name': 'Committees For Community Portal',
    'category': 'website',
    'summary': 'Committees management',
    'version': '12.0.1.0.5',
    'license': 'LGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'website_community_portal',
    ],
    'data': [
        'security/portal_security.xml',
        'security/ir.model.access.csv',
        'data/sequence.xml',
        'data/website_menu.xml',
        'views/res_partner_view.xml',
        'views/job_assign_view.xml',
        'views/template_committee_chart.xml',
        'views/template_committee_grid.xml'
    ],
    'installable': True,
    'application': True,
}
