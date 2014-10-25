// Interface and implementation of trie data structure

exports.Trie = Trie;

/*
 *  Public
 */

// caseCode:
// - 0 = case-sensitive, retain original case
// - 1 = upper, uppercase all values
// - 2 = lower, lowercase all values
function Trie (caseCode) {

	// Keep track of case preference
	this.upper = false;
	this.lower = false;
	if (caseCode == 1) { this.upper = true; }
	else if (caseCode == 2) { this.lower = true; }

	// Internal trie structure as JSON
	this._trie = {
		val: []
	};
}

// Add a key-value to the trie
// @param: key, where key is a string 
// @param: value, where value is any object
Trie.prototype.add = function (key, value) {
	
	// Depending on user case preference, alter key
	if (this.upper) {
		key = key.toUpperCase();
	}
	else if (this.lower) {
		key = key.toLowerCase();
	}

	var currLetter;
	var currTrie = this._trie;

	for (var i in key) {
		currLetter = key[i];

		// Traverse the internal trie structure
		if (currTrie[currLetter]) {
			currTrie.val.push(value);
			currTrie = currTrie[currLetter];
		}
		else {
			currTrie[currLetter] = {};
			currTrie[currLetter]['val'] = [value];
			currTrie = currTrie[currLetter];
		}
	}

	currTrie['val'].push(value);
}

// Query a key from the trie
// @param: key, where key is a string
Trie.prototype.search = function (key) {
	
	// Depending on user case preference, alter key
	if (this.upper) {
		key = key.toUpperCase();
	}
	else if (this.lower) {
		key = key.toLowerCase();
	}

	var currLetter;
	var currTrie = this._trie;

	for (var i in key) {
		currLetter = key[i];

		// Traverse the internal trie structure
		if (currTrie[currLetter]) {
			currTrie = currTrie[currLetter];
		}
		else {
			return {};
		}
	}

	if (currTrie.val) { 
		var hasSeen = {}
		return currTrie.val.filter(function(e) { return hasSeen[e.id] ? false : hasSeen[e.id] = true });
	}		
	else { return []; }
}