type ChangeSteamCRUDOperationCallbacks<T> = {
	insert?: (doc: T) => void;
	update?: (doc: T) => void;
	replace?: (doc: T) => void;
	delete?: (doc: T) => void;
};
