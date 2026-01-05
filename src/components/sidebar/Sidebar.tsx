import { useState, useCallback } from 'react';
import { useAppStore, useShallow } from '../../hooks/useStore';
import { store } from '../../store';
import { FXContainer } from '../fx';
import type { FX } from '../../FX/FX';
import styles from './Sidebar.module.css';

// Available keys
const KEYS = ['A', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E'];

// Available scales
const SCALES = [
  'Major',
  'minor',
  'Pentatonic',
  'Harm-minor',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'CHROMATIC',
];

// Available effect types
const EFFECT_TYPES = ['Fuzz', 'Double', 'Comp', 'Delay', 'Reverb'];

interface MasterControlProps {
  onAddEffect?: (name: string) => void;
  effects?: FX[];
  onRemoveEffect?: (fx: FX) => void;
}

function MasterControl({
  onAddEffect,
  effects = [],
  onRemoveEffect,
}: MasterControlProps) {
  const { name, bpm, key, scale } = useAppStore(
    useShallow((state) => ({
      name: state.scene.name,
      bpm: state.scene.bpm,
      key: state.scene.key,
      scale: state.scene.scale,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editBpm, setEditBpm] = useState(bpm);
  const [editKey, setEditKey] = useState(key);
  const [editScale, setEditScale] = useState(scale);
  const [selectedEffect, setSelectedEffect] = useState(EFFECT_TYPES[0]);

  const handleEdit = useCallback(() => {
    setEditName(name);
    setEditBpm(bpm);
    setEditKey(key);
    setEditScale(scale);
    setIsEditing(true);
  }, [name, bpm, key, scale]);

  const handleSave = useCallback(() => {
    store.getState().setScene({
      name: editName,
      bpm: editBpm,
      key: editKey,
      scale: editScale,
    });
    setIsEditing(false);
  }, [editName, editBpm, editKey, editScale]);

  const handleAddEffect = useCallback(() => {
    onAddEffect?.(selectedEffect);
  }, [onAddEffect, selectedEffect]);

  // Display string for current settings
  const displayText = `${bpm} BPM  ${key}  ${scale}`;

  const handleRemoveEffect = useCallback(
    (fx: FX) => {
      onRemoveEffect?.(fx);
    },
    [onRemoveEffect]
  );

  return (
    <div className={styles.master}>
      <div className={styles.effects}>
        <fieldset
          className={`${styles.module} ${styles.name} ${styles.masterControl}`}
        >
          <legend>
            <input
              name="name"
              type="text"
              value={isEditing ? editName : name}
              onChange={(e) => setEditName(e.target.value)}
              readOnly={!isEditing}
            />
          </legend>

          {!isEditing ? (
            <div className={`${styles.display} ${styles.clearfix}`}>
              <div className={styles.displayCurrentControl}>{displayText}</div>
              <input
                name="edit"
                type="button"
                value="edit"
                onClick={handleEdit}
              />
            </div>
          ) : (
            <div className={styles.controlEdit}>
              <div className={`${styles.control} ${styles.clearfix}`}>
                <label>key</label>
                <select
                  name="key"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                >
                  {KEYS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className={`${styles.control} ${styles.clearfix}`}>
                <label>scale</label>
                <select
                  name="mode"
                  value={editScale}
                  onChange={(e) => setEditScale(e.target.value)}
                >
                  {SCALES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={`${styles.control} ${styles.clearfix}`}>
                <label>bpm</label>
                <input
                  name="bpm"
                  type="number"
                  min="0"
                  max="50000"
                  value={editBpm}
                  onChange={(e) => setEditBpm(Number(e.target.value))}
                />
              </div>

              <div className={`${styles.control} ${styles.clearfix}`}>
                <input
                  name="save"
                  type="button"
                  value="save"
                  onClick={handleSave}
                />
              </div>
            </div>
          )}
        </fieldset>
        <FXContainer effects={effects} onRemove={handleRemoveEffect} />
      </div>

      <fieldset className={`${styles.module} ${styles.addEffect} ${styles.clearfix}`}>
        <select
          value={selectedEffect}
          onChange={(e) => setSelectedEffect(e.target.value)}
        >
          {EFFECT_TYPES.map((fx) => (
            <option key={fx}>{fx}</option>
          ))}
        </select>
        <input
          type="button"
          value="add"
          onClick={handleAddEffect}
        />
      </fieldset>
    </div>
  );
}

interface TracksControlProps {
  trackName: string;
  onNameChange?: (name: string) => void;
  onAddEffect?: (name: string) => void;
  effects?: FX[];
  onRemoveEffect?: (fx: FX) => void;
}

function TracksControl({
  trackName,
  onNameChange,
  onAddEffect,
  effects = [],
  onRemoveEffect,
}: TracksControlProps) {
  const [selectedEffect, setSelectedEffect] = useState(EFFECT_TYPES[0]);

  const handleAddEffect = useCallback(() => {
    onAddEffect?.(selectedEffect);
  }, [onAddEffect, selectedEffect]);

  const handleRemoveEffect = useCallback(
    (fx: FX) => {
      onRemoveEffect?.(fx);
    },
    [onRemoveEffect]
  );

  return (
    <div className={styles.tracks}>
      <div className={styles.effects}>
        <fieldset className={`${styles.module} ${styles.name}`}>
          <legend>
            <input
              name="name"
              type="text"
              value={trackName}
              onChange={(e) => onNameChange?.(e.target.value)}
            />
          </legend>
        </fieldset>
        <FXContainer effects={effects} onRemove={handleRemoveEffect} />
      </div>

      <fieldset className={`${styles.module} ${styles.addEffect} ${styles.clearfix}`}>
        <select
          value={selectedEffect}
          onChange={(e) => setSelectedEffect(e.target.value)}
        >
          {EFFECT_TYPES.map((fx) => (
            <option key={fx}>{fx}</option>
          ))}
        </select>
        <input
          type="button"
          value="add"
          onClick={handleAddEffect}
        />
      </fieldset>
    </div>
  );
}

export interface SidebarProps {
  mode: 'master' | 'tracks';
  trackIndex?: number;
  trackName?: string;
  onTrackNameChange?: (name: string) => void;
  onAddMasterEffect?: (name: string) => void;
  onAddTracksEffect?: (name: string) => void;
  masterEffects?: FX[];
  trackEffects?: FX[];
  onRemoveMasterEffect?: (fx: FX) => void;
  onRemoveTrackEffect?: (fx: FX) => void;
}

export function Sidebar({
  mode,
  trackName = '',
  onTrackNameChange,
  onAddMasterEffect,
  onAddTracksEffect,
  masterEffects = [],
  trackEffects = [],
  onRemoveMasterEffect,
  onRemoveTrackEffect,
}: SidebarProps) {
  // Calculate sidebar position based on mode
  const sidebarLeft = mode === 'tracks' ? '0px' : '-223px';

  return (
    <div className={styles.sidebarWrapper} style={{ left: sidebarLeft }}>
      <div className={`${styles.tracksWrapper} ${styles.sidebar}`}>
        <TracksControl
          trackName={trackName}
          onNameChange={onTrackNameChange}
          onAddEffect={onAddTracksEffect}
          effects={trackEffects}
          onRemoveEffect={onRemoveTrackEffect}
        />
      </div>

      <div className={`${styles.masterWrapper} ${styles.sidebar}`}>
        <MasterControl
          onAddEffect={onAddMasterEffect}
          effects={masterEffects}
          onRemoveEffect={onRemoveMasterEffect}
        />
      </div>
    </div>
  );
}

// Export styles for FX views
export { styles as sidebarStyles };
