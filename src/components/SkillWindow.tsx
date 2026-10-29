'use client';

import type {
  Active,
  Over,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import type { Gw1Attribute } from '@prisma/client';
import type { Gw1Skill } from '@/types';

import {
  useState,
  useEffect,
  useContext
} from 'react';
import {
  useParams
} from 'next/navigation';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  snapCenterToCursor,
} from '@dnd-kit/modifiers';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/common/Accordion';
import { Toaster } from '@/components/common/Toaster';
import SkillList from '@/components/SkillList';
import SkillBar from '@/components/SkillBar';
import SkillOverlay from '@/components/SkillOverlay';
import SkillCost from '@/components/SkillCost';
import { TeamContext } from '@/context/team';
import { noSkill } from '@/lib/noSkill';
import { useToast } from '@/lib/useToast';
import { getSkillTypeName } from '@/lib/skillType';

export default function SkillWindow({
  profession,
  attributes,
  allSkills,
}: {
  profession: string,
  attributes: Gw1Attribute[],
  allSkills: Gw1Skill[],
}) {
  const { toast } = useToast()
  const { slug } = useParams();
  const { team, newPlayer, updateBuild } = useContext(TeamContext);
  const [activeSkill, setActiveSkill] = useState<Gw1Skill>();
  const [skills, setSkills] = useState<Gw1Skill[]>(allSkills);
  const [build, setBuild] = useState<Gw1Skill[]>(
    Array.from({ length: 8 }, (_, i) => ({ ...noSkill, id: -(i + 1)}))
  );

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
      delay: 60,
      tolerance: 3,
    }}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function switchItem(active: Active, over: Over) {
    if (active.id !== over.id) {
      setBuild((items) => {
        const oldIndex = items.findIndex(x => x.id === active.id);
        const newIndex = items.findIndex(x => x.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function addItem(active: Active, over: Over) {
    const item = skills.find((x) => x.id == active.id);
    if (item) {
      const index = over.data.current?.sortable.index;
      const replaced = build[index];
      const elite = build.filter(x => x.elite);
      const pve = build.filter(x => x.rp);
      if (elite.length >= 1 && (item.elite && !replaced.elite)) return;
      if (pve.length >= 3 && (item.rp && !replaced.rp)) return;
      if (replaced.id > 0) {
        setSkills((items) => {
          const array = [...items, replaced];
          return array.sort((a, b) => a.pve_name.localeCompare(b.pve_name, undefined));
        });
      }
      setSkills((items) => items.filter(x => x.id !== active.id));
      setBuild((items) => {
        const updatedArray = [...items];
        updatedArray[index] = item;
        return updatedArray;
      });
    }
  }

  function throwItem(active: Active) {
    const item = build.find((x) => x.id == active.id);
    const index = active.data.current?.sortable?.index;
    if (item) {
      setBuild((items) => {
        const updatedArray = [...items];
        updatedArray[index] = noSkill;
        return updatedArray;
      });
      setSkills((items) => {
        const array = [...items, item];
        return array.sort((a, b) => a.pve_name.localeCompare(b.pve_name, undefined));
      });
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const skill = allSkills.find(x => x.id === active.id);
    if (skill) {
      setActiveSkill(skill);
      toast({
        title: skill?.pve_name,
        description: (
          <>
            <SkillCost skill={skill} />
            <p className="mt-2 text-xs">
              {getSkillTypeName(skill)}:  {skill?.pve_desc}
            </p>
          </>
        ),
        duration: Infinity,
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over) {
      const activeContainer = active.data?.current?.sortable?.containerId;
      const overContainer = over.data?.current?.sortable?.containerId;
      if (activeContainer === 'build' && overContainer === 'build') { //switch item
        switchItem(active, over);
      } else if (activeContainer === 'build' && overContainer === 'skills') { //throw item
        throwItem(active);
      } else if (overContainer === 'build') { //add item
        addItem(active, over);
      }
    }
    setActiveSkill(noSkill);
  }

  useEffect(() => {
    const id = parseInt(slug as string) || 1;
    const player = team.find(x => x.id == id);
    if (player) {
      setSkills(() => allSkills.filter(
        skill => !player.build.some(x => x.id === skill.id))
      );
      return setBuild(player.build.map((skill, i) => 
        allSkills.some(x => x.id === skill.id)
        ? skill
        : { ...noSkill, id: -(i + 1) }
      ));
    } else return newPlayer(id, profession);
  }, [allSkills, profession]);

  useEffect(() => {
    const id = parseInt(slug as string) || 1;
    return updateBuild(id, build)
  }, [build]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={{ acceleration: 1 }}
      modifiers={[snapCenterToCursor]}
    >
      <Toaster />
      <SortableContext id="skills" items={skills}>
        <div className="mb-20 bg-gray-100 dark:bg-gray-800">
          <Accordion type="multiple">
            {attributes.map(attribute => (
              <AccordionItem key={attribute.id} value={`attr-${attribute.id}`}>
                <AccordionTrigger className="mx-2">
                  {attribute.name_en}
                </AccordionTrigger>
                <AccordionContent className="space-y-1">
                  <SkillList
                    skills={skills.filter(x => x.attribute == attribute.id)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SortableContext>

      <SortableContext id="build" items={build}>
        <SkillBar build={build} />
      </SortableContext>

      <DragOverlay>
        <SkillOverlay activeSkill={activeSkill} />
      </DragOverlay>
    </DndContext>
  );
}
