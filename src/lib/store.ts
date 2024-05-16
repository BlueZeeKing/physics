import { writable } from 'svelte/store';

export interface TableValues {
	keys: string[];
	values: { [key: string]: string[] };
}

export interface UnitTableValues extends TableValues {
	units: { [key: string]: string };
}

export const given = writable<UnitTableValues>({
	keys: ['m_1', 'm_2', 'd', 't'],
	values: { m_1: [], m_2: [], d: [], t: [] },
	units: { m_1: 'kg', m_2: 'kg', d: 'm', t: 's' }
});

export const derived = writable<TableValues>({
	keys: ['x', 'y'],
	values: { x: [], y: [] }
});
