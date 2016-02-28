
function ListNode(val) {
    this.val = val;
    this.next = null;
}

var oddEvenList = function(head) {
    if (head && head.next) {
	    var ehead = head.next, po = head, pe = ehead;
	    while (true) {
	        if (pe.next) po = po.next = pe.next; else break;
	        if (po.next) pe = pe.next = po.next; else break;
	    }
	    po.next = ehead, pe.next = null;
    }
    return head;
};

var l2a = function(h) {
	var r = [];
	while(h) {
		r.push(h.val);
		h = h.next;
	}
	return r;
};

var a2l = function(a) {
	var h;
	if (a.length) {
		var p;
		a.forEach(function(v) {
			if (!p) {
				h = p = new ListNode(v);
			} else {				
				p.next = new ListNode(v);
				p = p.next;
			}
		});
	}
	return h;
};

var l = a2l([1,2,3]);
var r = oddEvenList(l);
// console.log(l2a(r));
