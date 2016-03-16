
(define (p) (p))

(define (test x y)
	(if (= x 0)
	    0
	    y))

(test 0 (p))

; Normal order: 0
; Applicative order: infinity loop
