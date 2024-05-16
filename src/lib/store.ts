import { writable } from 'svelte/store';

export interface TableValues {
	keys: string[];
	values: { [key: string]: string[] };
}

export const given = writable<TableValues>({
	keys: ['m_1', 'm_2', 'd', 't'],
	values: { m_1: [], m_2: [], d: [], t: [] }
});

export const derived = writable<TableValues>({
	keys: ['x', 'y'],
	values: { x: [], y: [] }
});
