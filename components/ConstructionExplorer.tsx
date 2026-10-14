"use client";

import { useId, useState } from "react";
import Image from "next/image";
function ArrowRight({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>; }

export type ConstructionZone = "earthwork" | "connections" | "drainage" | "road" | "utilities" | "landscaping";
export type ConstructionActivity = {
  id: string;
  zone: ConstructionZone;
  title: string;
  description: string;
  services: string[];
  href: string;
  photo?: { src: string; alt: string; caption: string; href?: string };
};
export type ConstructionExplorerProps = {
  activities: ConstructionActivity[];
  heading?: string;
  introduction?: string;
  allActivitiesHref?: string;
};
const zones: ConstructionZone[] = ["earthwork", "connections", "drainage", "road", "utilities", "landscaping"];
const captions = ["Préparation des sols", "Voirie et réseaux divers", "Gestion des eaux", "Accès et revêtements", "Réseaux enterrés", "Aménagements extérieurs"];

export function ConstructionExplorer({ activities, heading = "Explore the site", introduction = "Choose a layer to inspect its role in a construction project.", allActivitiesHref }: ConstructionExplorerProps) {
  const instanceId = useId().replace(/:/g, "");
  const titleId = instanceId + "-title";
  const detailId = instanceId + "-detail";
  const earthId = instanceId + "-earth";
  const pavingId = instanceId + "-paving";
  const [selected, setSelected] = useState(0);
  const activity = activities[selected] ?? activities[0];
  if (!activity) return null;
  const activeZone = zones.indexOf(activity.zone);
  const lit = (index: number) => activeZone === index || (activeZone === 1 && [3, 4].includes(index)) ? "is-lit" : "";

  return (
    <section className="ce-activities" aria-labelledby={titleId}>
      <div className="ce-container">
        <div className="ce-section-heading">
          <p className="ce-eyebrow">Schéma interactif</p>
          <h2 id={titleId}>{heading}</h2>
          <p>{introduction}</p>
        </div>
        <div className="ce-explorer">
          <div className="ce-activity-menu" role="group" aria-label="Choisir une activité">
            {activities.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls={detailId} onClick={() => setSelected(index)}>
              <span className="ce-menu-index">{index + 1}</span><span>{item.title}</span>
            </button>)}
            {allActivitiesHref ? <a className="ce-all-activities" href={allActivitiesHref}>Toutes les activités <ArrowRight size={16} /></a> : null}
          </div>
          <div className="ce-visual-column">
            <div className="ce-diagram">
              <div className="ce-diagram-caption"><span>Coupe du terrain</span><span>Vue schématique</span></div>
              <div className="ce-diagram-drawing">
              <svg viewBox="0 0 800 480" aria-hidden="true" focusable="false">
                <defs>
                  <pattern id={earthId} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M4 6h3M15 17h2" stroke="#9b9b9b" strokeWidth="2" opacity=".4" /></pattern>
                  <pattern id={pavingId} width="24" height="16" patternUnits="userSpaceOnUse"><path d="M0 0h24v16H0ZM12 0v16" fill="none" stroke="#a3a3a3" strokeWidth=".6" /></pattern>
                </defs>
                <path d="M65 293 425 144 745 265 385 427Z" fill="#d5d5d5" />
                <g className={`ce-earth-layer ${lit(0)}`}>
                  <path d="m65 247 360-149 320 121v73L385 441 65 320Z" fill="#bdbdbd" />
                  <path d="m65 247 320 122v72L65 320Z" fill="#a5a5a5" />
                  <path d="m65 247 320 122v72L65 320Z" fill={`url(#${earthId})`} />
                  <path d="m385 369 360-150v73L385 441Z" fill="#b0b0b0" />
                  <path d="m385 369 360-150v73L385 441Z" fill={`url(#${earthId})`} />
                </g>
                <g className={`ce-ground-layer ${lit(0)}`}><path d="m65 247 360-149 320 121-360 150Z" fill="#dddddd" /><path d="m80 243 98-40 133 50-98 41Z" fill="#cccccc" /><path d="m101 243 64-26 90 34-64 27Z" fill="#898989" /></g>
                <g className={`ce-garden-layer ${lit(5)}`}><path d="m213 215 212-88 120 46-213 89Z" fill="#ededed" /><path d="m213 215 212-88 120 46-213 89Z" fill={`url(#${pavingId})`} /><path d="m121 211 44-18 30 11-44 19Z" fill="#d5d5d5" /><path d="m121 211v16l30 12v-16" fill="#b0b0b0" /><path d="m143 205v-42" stroke="#a0a0a0" strokeWidth="7" /><ellipse cx="143" cy="153" rx="28" ry="23" fill="#b2b2b2" /><path d="M605 202v-46" stroke="#a0a0a0" strokeWidth="7" /><ellipse cx="605" cy="142" rx="26" ry="28" fill="#b2b2b2" /></g>
                <g className={`ce-road-layer ${lit(3)}`}><path d="m330 302 237-98 140 53-237 99Z" fill="#8e8e8e" /><path d="m330 302 140 54v10l-140-53Z" fill="#c8c8c8" /><path d="m470 356 237-99v10l-237 99Z" fill="#d7d7d7" /><path d="m458 320 129-54" stroke="#ffffff" strokeWidth="3" strokeDasharray="16 13" /></g>
                <g strokeLinejoin="round"><path d="m294 196 130-54 111 42v-94l-111-42-130 54Z" fill="#f3f3f3" /><path d="m294 102 130 50v98l-130-50Z" fill="#dadada" /><path d="m424 152 111-46v94l-111 50Z" fill="#f5f5f5" /><path d="m274 100 146-61 135 51-131 62Z" fill="#696969" /><path d="m324 142 36 14v48l-36-14Z" fill="#9d9d9d" /><path d="m382 167 24 9v62l-24-9Z" fill="#888888" /><path d="m448 164 25-10v32l-25 10Z" fill="#acacac" /><path d="m491 147 25-10v32l-25 10Z" fill="#acacac" /></g>
                <g className={`ce-water-layer ${lit(2)}`} fill="none" stroke="#424242" strokeWidth="9" strokeLinejoin="round"><path d="M452 240v43l108 42-91 38v48" /><path d="m507 318 42-18" /><ellipse cx="560" cy="325" rx="18" ry="9" fill="#696969" strokeWidth="4" /><path d="M560 325v31" strokeWidth="5" /></g>
                <g className={`ce-network-layer ${lit(4)}`} fill="none" strokeWidth="6" strokeLinejoin="round"><path d="M371 243v45l-120 49v41" stroke="#5f5f5f" /><path d="M389 249v48l-117 48v40" stroke="#8c8c8c" /><path d="M402 256v51l-107 44v43" stroke="#b2b2b2" /></g>
                <path d="m65 320 320 121 360-149" fill="none" stroke="#808080" strokeOpacity=".25" />
              </svg>
              {activities.map((item, index) => <button key={item.id} className={`ce-hotspot ce-hotspot-${zones.indexOf(item.zone)} ${selected === index ? "is-selected" : ""}`} type="button" aria-label={`Explorer : ${item.title}`} aria-pressed={selected === index} aria-controls={detailId} onClick={() => setSelected(index)}>{index + 1}</button>)}
              </div>
              <p className="ce-diagram-hint">Sélectionnez une activité ou un point sur le schéma.</p>
            </div>
            <article id={detailId} className="ce-activity-detail" aria-live="polite" aria-atomic="true">
              {activity.photo ? <div className="ce-detail-photo"><Image src={activity.photo.src} alt={activity.photo.alt} width={960} height={560} sizes="(min-width: 900px) 38vw, 100vw" /><span>{activity.photo.href ? <a href={activity.photo.href}>{activity.photo.caption}</a> : activity.photo.caption}</span></div> : null}
              <div className="ce-detail-copy"><p className="ce-detail-kicker">{captions[activeZone]}</p><h3>{activity.title}</h3><p>{activity.description}</p><ul>{activity.services.slice(0, 3).map(service => <li key={service}>{service}</li>)}</ul><a href={activity.href}>Détail de l’activité <ArrowRight size={18} /></a></div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
