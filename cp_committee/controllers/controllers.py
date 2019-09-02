# See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request


class WebsiteCommittees(http.Controller):
    @http.route(['/page/committee'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_committee_page(self, page=0, ppg=False, **post):
        job_pos_data = request.env['job.position'].search([])
        res_partner = request.env['res.partner'].search([])
        vals = {
            'job_positions': job_pos_data,
            'res_partner': res_partner
        }
        return request.render('cp_committee.template_committee_chart', vals)

    @http.route(['/page/committee/list'], type='http', auth="public",
                method=['post'], website=True, csrf=False)
    def show_committee_page_grid(self, page=0, ppg=False, **post):
        job_pos_data = request.env['job.position'
                                   ].search([], order='sequence ASC')

        vals = {
            'job_pos_data': job_pos_data
        }
        return request.render('cp_committee.template_committee_grid', vals)
