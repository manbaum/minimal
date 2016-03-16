

(define (max2 a b) (if (> a b) a b))

(define (max3 a b c) (max2 a (max2 b c)))

(define (max3' a b c) (if (> a b) (if (> a c) a c) (if (> b c) b c)))