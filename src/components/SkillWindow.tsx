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
  useMemo,
  useRef,
  useContext
} from 'react';
import {
  useParams
} from 'next/navigation';
import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { MouseSensor } from '@/components/dnd/MouseSensor';
import {
  snapCenterToCursor,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/common/Accordion';
import { Toaster } from '@/components/common/Toaster';
import { Button } from '@/components/common/Button';
import SkillList from '@/components/SkillList';
import SkillBar from '@/components/SkillBar';
import SkillOverlay from '@/components/SkillOverlay';
import SkillCost from '@/components/SkillCost';
import AttributeDialog from '@/components/dialog/AttributeDialog';
import { TeamContext } from '@/context/team';
import { noSkill } from '@/lib/noSkill';
import { useToast } from '@/lib/useToast';
import { getSkillTypeName } from '@/lib/skillType';
import { formatSkillDescription } from '@/lib/skill-scaling';
import Remeasure from '@/components/dnd/Remeasure';

export default function SkillWindow({
  profession,
  attributes,
  allSkills,
}: {
  profession: string,
  attributes: Gw1Attribute[],
  allSkills: Gw1Skill[],
}) {
  const { toast, dismiss } = useToast()
  const { slug } = useParams();
  const { team, newPlayer, updateBuild } = useContext(TeamContext);
  const toastId = useRef<string | undefined>(undefined);
  const [activeSkill, setActiveSkill] = useState<Gw1Skill>();
  const [skills, setSkills] = useState<Gw1Skill[]>(allSkills);
  const [build, setBuild] = useState<Gw1Skill[]>(
    Array.from({ length: 8 }, (_, i) => ({ ...noSkill, id: -(i + 1)}))
  );

  const sensors = useSensors(
    // mouse-only: touch pointers are handled exclusively by the TouchSensor
    // (a PointerSensor-activated drag gets pointercancelled by browser panning)
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
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

  function switchItemToIndex(active: Active, index: number) {
    setBuild((items) => {
      const oldIndex = items.findIndex(x => x.id === active.id);
      if (oldIndex === -1 || oldIndex === index) return items;
      return arrayMove(items, oldIndex, index);
    });
  }

  function addItem(active: Active, over: Over) {
    const index = over.data.current?.sortable.index;
    if (index !== undefined) addItemToIndex(active, index);
  }

  function addItemToIndex(active: Active, index: number) {
    const item = skills.find((x) => x.id == active.id);
    if (item) {
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

  /**
   * Resolve the drop slot from the live bar geometry instead of dnd-kit's
   * cached droppable rects: while hovering, slots displace to make room and
   * cached rects drift (notably on mobile), so drops landed several slots off.
   */
  function barIndexAt(active: Active): number | null {
    const bar = document.getElementById('gw-skill-bar');
    const translated = active.rect.current.translated;
    if (!bar || !translated) return null;
    const rect = bar.getBoundingClientRect();
    const x = translated.left + translated.width / 2;
    if (x < rect.left || x > rect.right) return null;
    const slotWidth = rect.width / 8;
    return Math.min(7, Math.max(0, Math.floor((x - rect.left) / slotWidth)));
  }

  function throwItem(active: Active) {
    const item = build.find((x) => x.id == active.id);
    const index = active.data.current?.sortable?.index;
    if (item && index !== undefined) {
      setBuild((items) => {
        const updatedArray = [...items];
        updatedArray[index] = { ...noSkill, id: -(index + 1) };
        return updatedArray;
      });
      setSkills((items) => {
        const array = [...items, item];
        return array.sort((a, b) => a.pve_name.localeCompare(b.pve_name, undefined));
      });
    }
  }

  function dismissToast() {
    if (toastId.current !== undefined) {
      dismiss(toastId.current);
      toastId.current = undefined;
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const skill = allSkills.find(x => x.id === active.id);
    if (skill) {
      setActiveSkill(skill);
      const id = parseInt(slug as string) || 1;
      const player = team.find(x => x.id === id);
      const rank = Number(player?.attributes?.[String(skill.attribute)] ?? 0);
      const { id: tid } = toast({
        title: skill?.pve_name,
        description: (
          <>
            <SkillCost skill={skill} />
            <p className="mt-2 text-xs">
              {getSkillTypeName(skill)}:  {formatSkillDescription(skill.pve_desc, rank)}
            </p>
          </>
        ),
        duration: Infinity,
      });
      toastId.current = tid;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    dismissToast();
    const { active, over } = event;
    const activeContainer = active.data?.current?.sortable?.containerId;

    // drop slot from live bar geometry — cached rects drift while slots
    // displace mid-drag (mobile drops landed several slots off)
    const targetIndex = barIndexAt(active);

    if (targetIndex !== null) {
      if (activeContainer === 'build') {
        switchItemToIndex(active, targetIndex);
      } else {
        addItemToIndex(active, targetIndex);
      }
    } else if (over) {
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

  function handleDragCancel() {
    dismissToast();
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

  const skillIds = useMemo(() => skills.map(x => x.id), [skills]);
  const buildIds = useMemo(() => build.map(x => x.id), [build]);
  const droppableIds = useMemo(
    () => [...skillIds, ...buildIds],
    [skillIds, buildIds]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // droppable rects must be re-measured while dragging: the sortable shift
      // animation displaces bar slots to make room for the incoming skill, and
      // stale cached rects make drops land several slots off (mobile touch)
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={{ acceleration: 1 }}
    >
      <Remeasure ids={droppableIds} />
      <Toaster />
      <SortableContext id="skills" items={skills} strategy={verticalListSortingStrategy}>
        <div className="mb-20 bg-gray-100 dark:bg-gray-800">
          <div className="px-2 pt-2">
            <AttributeDialog
              playerId={parseInt(slug as string) || 1}
              attributes={attributes}
            >
              <Button variant="light">
                Attribute Points
              </Button>
            </AttributeDialog>
          </div>
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

      <SortableContext id="build" items={build} strategy={horizontalListSortingStrategy}>
        <SkillBar build={build} />
      </SortableContext>

      <DragOverlay modifiers={[snapCenterToCursor]}>
        <SkillOverlay activeSkill={activeSkill} />
      </DragOverlay>
    </DndContext>
  );
}
