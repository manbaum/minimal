
(define (a-plus-abs-b a b) ((if (> b 0) + -) a b))

; b > 0 时 用 a 加上 b
; b <= 0 时 用 a 减去 b
