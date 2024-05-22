import { writable } from 'svelte/store';

export interface TableValues {
	keys: string[];
	values: { [key: string]: string[] };
}

export interface UnitTableValues extends TableValues {
	units: { [key: string]: string };
}

const startGiven: UnitTableValues = {
	keys: ['m_1', 'm_2', 'd', 't'],
	values: { m_1: [], m_2: [], d: [], t: [] },
	units: { m_1: 'kg', m_2: 'kg', d: 'm', t: 's' }
};

export const given = writable<UnitTableValues>(startGiven);
export const derived = writable<TableValues>({
	keys: ['x', 'y'],
	values: { x: [], y: [] }
});

function readFromLocal(): UnitTableValues {
	let value = window.localStorage.getItem('tableData');
	if (!value) {
		return startGiven;
	}

	let data: UnitTableValues = JSON.parse(value);

	given.set(data);

	return data;
}

function writeToLocal(given: UnitTableValues) {
	window.localStorage.setItem('tableData', JSON.stringify(given));
}

export function startLocal() {
	let givenValue = readFromLocal();

	given.subscribe((newGiven) => {
		givenValue = newGiven;
		writeToLocal(givenValue);
	});
}

export function reset() {
	given.set(startGiven);
}
