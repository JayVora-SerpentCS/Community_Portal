# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

import base64
import tempfile
import csv
from odoo import api, fields, models, _
from xlrd import open_workbook
from odoo.exceptions import UserError


class EventAttendees (models.TransientModel):
    _name = 'event.attendees'

    event_id = fields.Many2one(
        "event.event",
        "Event",
        required=True
        )
    attendees_csv = fields.Binary("Attendees CSV file")
    file_name = fields.Char('File name')

    @api.model
    def default_get(self, fields):
        rec = super(EventAttendees, self).default_get(fields)
        context = dict(self._context or {})
        active_ids = context.get('active_ids')
        if active_ids:
            rec.update({
                'event_id': active_ids[0]
            })
        return rec

    @api.multi
    def record_create(self, vals):
        already_ragi_ids = self.env['event.registration'].\
            search([('event_id', '=', self.event_id.id),
                    ('email', '=', vals.get('email', False))])
        if not already_ragi_ids:
            self.env['event.registration'].create(vals)
        return True

    @api.multi
    def add_attendees(self):
        for rec in self:
            datafile = rec.attendees_csv
            file_name = str(rec.file_name)
            # Checking for Suitable File
            if not datafile or not file_name.lower().endswith(('.xls', '.csv')
                                                              ):
                raise UserError(_("""Please select an (Downloded Blank Template
                    ) .xls compatible file to Import"""))
            if file_name.lower().endswith(('.xls')):
                xls_data = base64.decodestring(datafile)
                temp_path = tempfile.gettempdir()
                # writing a file to temp. location
                fp = open(temp_path + '/xsl_file.xls', 'wb+')
                fp.write(xls_data)
                fp.close()
                # opening a file form temp. location
                wb = open_workbook(temp_path + '/xsl_file.xls')
                header_list = []
                data_list = []
                headers_dict = {}
                for sheet in wb.sheets():
                    for rownum in range(sheet.nrows):
                        if rownum == 0:
                            header_key = [x.strip().encode().decode('utf-8')
                                          for x in sheet.row_values(rownum)]
                            # converting unicode chars into string
                            header_list = [x.strip().encode().decode('utf-8')
                                           for x in sheet.row_values(rownum)]
                            fixed_list = ['name', 'email', 'phone']
                            for column in fixed_list:
                                if column not in header_list:
                                    raise UserError(_("""
            Column Named = '%s' Not Found in Uploaded File. Please Upload The
            File Having At least Columns like :- %s""" % (column, fixed_list)))
                            index = []
                            for x in header_list:
                                index.append(header_list.index(x))
                            if header_key and index:
                                headers_dict = dict(zip(header_key, index))
                        if rownum >= 1:
                            data_list.append(sheet.row_values(rownum))
                if data_list and headers_dict:
                    for row in data_list:
                        vals = {}
                        for key in header_key:
                            if row[headers_dict[str(key)]]:
                                vals.update({str(key):
                                             row[headers_dict[str(key)]]})
                                vals.update({'event_id': self.event_id.id})
                        self.record_create(vals)
            else:
                file_path = tempfile.gettempdir() + '/csv_file.csv'
                f = open(file_path, 'wb')
                f.write(base64.decodestring(self.attendees_csv))
                f.close()
                data_reader = csv.reader(open(file_path))
                fields = data_reader.next()
                fixed_list = ['name', 'email', 'phone']
                for column in fixed_list:
                    if column not in fields:
                        raise UserError(_("""
            Column Named = '%s' Not Found in Uploaded File. Please Upload The
            File Having At least Columns like :- %s""" % (column, fixed_list)))
                list_line = []
                list_dict_line = []
                for line in data_reader:
                    list_line.append(line)
                for lines in list_line:
                    list_dict_line.append(dict(zip(fields, lines)))
                for value in list_dict_line:
                    value.update({'event_id': self.event_id.id})
                    self.record_create(value)
        return True
