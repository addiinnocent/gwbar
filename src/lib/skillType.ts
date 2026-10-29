import type { Gw1SkillData } from '@prisma/client';
import { Profession, SkillType } from '@/types';

export function getSkillTypeName(skillData: Gw1SkillData): string {
  return skillData.elite ? `Elite ${getTypeName()}` : getTypeName();

  function getTypeName(): string {
    switch (skillData.pve_type as SkillType) {
      case SkillType.Stance:
        return 'Stance';
      case SkillType.HexSpell:
        return 'Hex Spell';
      case SkillType.Spell:
        return 'Spell';
      case SkillType.EnchantmentSpell:
        return 'Enchantment spell';
      case SkillType.FlashEnchantment:
        return 'Flash Enchantment';
      case SkillType.Signet:
        return 'Signet';
      case SkillType.WellSpell:
        return 'Well Spell';
      case SkillType.WardSpell:
        return 'Ward Spell';
      case SkillType.Glyph:
        return 'Glyph';
      case SkillType.MeleeAttack:
        return 'Melee Attack';
      case SkillType.Shout:
        return 'Shout';
      case SkillType.Preparation:
        return 'Preparation';
      case SkillType.PetAttack:
        return 'Pet Attack';
      case SkillType.Trap:
        return 'Trap';
      case SkillType.BindingRitual:
      case SkillType.NatureRitual:
      case SkillType.EbonVanguardRitual:
        return getRitualType();
      case SkillType.ItemSpell:
        return 'Item Spell';
      case SkillType.WeaponSpell:
        return 'Weapon Spell';
      case SkillType.Form:
        return 'Form';
      case SkillType.TouchSkill:
        return 'Touch Skill';
      case SkillType.TouchSpell:
        return 'Touch Spell';
      case SkillType.TouchEnchantmentSpell:
        return 'Touch Enchantment Spell';
      case SkillType.TouchHexSpell:
        return 'Touch Hex Spell';
      case SkillType.TouchSignet:
        return 'Touch Signet';
      case SkillType.Chant:
        return 'Chant';
      case SkillType.Echo:
        return 'Echo';
      case SkillType.BowAttack:
        return 'Bow Attack';
      case SkillType.AxeAttack:
        return 'Axe Attack';
      case SkillType.LeadAttack:
        return 'Lead Attack';
      case SkillType.OffHandAttack:
        return 'Off-Hand Attack';
      case SkillType.DualAttack:
        return 'Dual Attack';
      case SkillType.HammerAttack:
        return 'Hammer Attack';
      case SkillType.ScytheAttack:
        return 'Scythe Attack';
      case SkillType.SwordAttack:
        return 'Sword Attack';
      case SkillType.SpearAttack:
        return 'Spear Attack';
      case SkillType.RangedAttack:
        return 'Ranged attack';
      default:
        return 'Skill';
    }
  }

  function getRitualType(): string {
    switch (skillData.profession as Profession) {
      case Profession.Ritualist:
        return 'Binding ritual';
      case Profession.Ranger:
        return 'Nature ritual';
      default:
        return 'Ebon Vanguard Ritual';
    }
  }
}
