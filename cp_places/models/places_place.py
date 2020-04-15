# See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api


class PlacesPlace(models.Model):
    _name = 'places.place'
    _description = 'Stores Community Place Details'
    _sql_constraints = [('nam_uniq', 'unique(place_name)',
                         'Place Already Exist')]

    # place details
    place_image = fields.Binary('Place Image')
    place_name = fields.Char('Place Name')
    name = fields.Char(string='location')
    street = fields.Char('Street')
    street2 = fields.Char('Street2')
    zip = fields.Char('Zip', change_default=True)
    city = fields.Char('City')
    state_id = fields.Many2one('res.country.state', string='State',
                               ondelete='restrict')
    country_id = fields.Many2one('res.country', string='Country',
                                 ondelete='restrict')
    place_description = fields.Text('Add Description Here')
    place_photos_ids = fields.One2many('places.photos', 'place_id',
                                       string='Select Photo To Add')
    place_type_id = fields.Many2one('places.type',
                                    string='Place Type')
    # owners infos
    place_owners_ids = fields.Many2many('res.partner',
                                        string='Responsible Perosn/s')
    partner_latitude = fields.Char(string='Latitude')
    partner_longitude = fields.Char(string='Longitude')
    phone = fields.Char()
    website = fields.Char()

    @api.multi
    def write(self, vals):
        if self.env.user.id == 1:
            return super(PlacesPlace, self).write(vals)
        if self.create_uid.id == self.env.user.id:
            return super(PlacesPlace, self).write(vals)
        else:
            pass

    @api.multi
    def unlink(self):
        search_record = self.search([('place_name', '=', self.place_name)]).id
        place_record = self.browse(search_record)
        if self.env.user.id == 1:
            return super(PlacesPlace, self).unlink()
        if place_record.write_uid.id == self.env.user.id:
            return super(PlacesPlace, self).unlink()
        else:
            pass


class PlaceReport(models.TransientModel):
    _name = 'report.place.types'

    state_id = fields.Many2one('res.country.state', string='State',
                               ondelete='restrict')
    place_type_id = fields.Many2one('places.type', string='Place Type')
    choise = fields.Selection([('01', 'State Wise'), ('02', 'Type Wise'),
                               ('03', 'Both')], string='Month')

    @api.multi
    def print_report(self):
        data = {}
        place_obj = self.env['places.place']
        if self.place_type_id and self.state_id:
            order = place_obj.search([
                ('place_type_id', '=', self.place_type_id.id),
                ('state_id', '<=', self.state_id.id)
            ])
        elif self.state_id:
            order = place_obj.search([('state_id', '=', self.state_id.id)])
        elif self.place_type_id:
            order = place_obj.\
                search([('place_type_id', '=', self.place_type_id.id)])
        data['form'] = self.read()[0]
        data['doc_ids'] = order.ids

        return self.env['report'].get_action(
            order.ids, 'cp_places.filter_place', data=data)


class PlaceReportRender(models.AbstractModel):
    _name = 'report.cp_places.filter_place'

    @api.model
    def render_html(self, docids, data=None):
        Report = self.env['report']
        place_report = Report._get_report_from_name(
            'cp_places.filter_place')
        if not data:
            data = {}
        if not docids:
            docids = data['doc_ids']
        place_data = self.env[place_report.model].browse(docids)
        docargs = {
            'doc_ids': docids,
            'doc_model': place_report.model,
            'docs': place_data,
            'data': data,
            'age1': 20,
            'form': data.get('form'),
        }
        return Report.render('cp_places.filter_place', docargs)
