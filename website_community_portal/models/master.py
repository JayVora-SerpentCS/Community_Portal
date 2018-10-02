# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import fields, models


class PartnerHeight(models.Model):
    _name = 'partner.height'

    name = fields.Char(string='Name')
    code = fields.Char(string='Code')


class Education(models.Model):
    _name = 'education.field'

    name = fields.Char(string='Name')
    code = fields.Char(string='Code')


class MotherTongue(models.Model):
    _name = 'mother.tongue'

    name = fields.Char(string='Mother Tongue')
    code = fields.Char(string='Code')


class LanguageLanguage(models.Model):
    _name = 'language.language'

    name = fields.Char(string='Language')
    code = fields.Char(string='Code')


class CommunityCommunity(models.Model):
    _name = 'community.community'

    name = fields.Char(string='Community')
    code = fields.Char(string='Code')


class SubCommunity(models.Model):
    _name = 'sub.community'

    name = fields.Char(string='Sub Community')
    code = fields.Char(string='Code')
    community_id = fields.Many2one(
        'community.community',
        string='Community',
        required=True
    )


class GotraGotra(models.Model):
    _name = 'gotra.gotra'

    name = fields.Char('Gotra')
    code = fields.Char('Code')
