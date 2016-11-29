
# Data is Code

The title of this post is a play on the Lisp aphorism: "Code is Data". In the Lisp world everything is data; code is just another data structure that you can manipulate and transform.

However, you can also go to the exact opposite extreme: "Data is Code"! You can make everything into code and implement data structures in terms of code.

You might wonder what that even means: how can you write any code if you don't have any primitive data structures to operate on? Fascinatingly, Alonzo Church discovered a long time ago that if you have the ability to define functions you have a complete programming language. "Church encoding" is the technique named after his insight that you could transform data structures into functions.

This post is partly a Church encoding tutorial and partly an announcement for my newly released `annah` compiler which implements the Church encoding of data types. Many of the examples in this post are valid `annah` code that you can play with. Also, to be totally pedantic `annah` implements Boehm-Berarducci encoding which you can think of as the typed version of Church encoding.

This post assumes that you have basic familiarity with lambda expressions. If you do not, you can read the first chapter (freely available) of the [Haskell Programming from First Principles](http://haskellbook.com/) which does an excellent job of teaching lambda calculus.

If you would like to follow along with these examples, you can download and install `annah` by following these steps:

*   Install [the `stack` tool](http://haskellstack.org/)
*   Create the following `stack.yaml` file

    

        $ cat > stack.yaml
        resolver: lts-5.13
        packages: []
        extra-deps:
        - annah-1.0.0
        - morte-1.6.0
        <Ctrl-D>

    

*   Run `stack setup`
*   Run `stack install annah`
*   Add the installed executable to your `$PATH`

#### Lambda calculus

In the untyped lambda calculus, you only have lambda expressions at your disposal and nothing else. For example, here is how you encode the identity function:



    λx → x



That's a function that takes one argument and returns the same argument as its result.

We call this "abstraction" when we introduce a variable using the Greek lambda symbol and we call the variable that we introduce a "bound variable". We can then use that "bound variable" anywhere within the "body" of the lambda expression.

    +-- Abstraction
    |
    |+-- Bound variable
    ||
    vv
    λx → x
         ^
         |
         +-- Body of lambda expression

Any expression that begins with a lambda is an anonymous function which we can apply to another expression. For example, we can apply the the identity function to itself like this:



    (λx → x) (λy → y)

    -- β-reduction
    = λy → y



We call this "application" when we supply an argument to an anonymous function.

We can define a function of multiple arguments by nested "abstractions":



    λx → λy → x



The above code is an anonymous function that returns an anonymous function. For example, if you apply the outermost anonymous function to a value, you get a new function:



    (λx → λy → x) 1

    -- β-reduce
    λy → 1



... and if you apply the lambda expression to two values, you return the first value:



    (λx → λy → x) 1 2

    -- β-reduce
    (λy → 1) 2

    -- β-reduce
    1



So our lambda expression behaves like a function of two arguments, even though it's really a function of one argument that returns a new function of one argument. We call this "currying" when we simulate functions of multiple arguments using functions one argument. We will use this trick because we will be programming in a lambda calculus that only supports functions of one argument.

#### Typed lambda calculus

In the typed lambda calculus you have to specify the types of all function arguments, so you have to write something like this:



    λ(x : a) → x



... where `a` is the type of the bound variable named `x`.

However, the above function is still not valid because we haven't specified what the type `a` is. In theory, we could specify a type like `Int`:



    λ(x : Int) → x



... but the premise of this post was that we could program without relying on any built-in data types so `Int` is out of the question for this experiment.

Fortunately, some typed variations of lambda calculus (most notably: "System F") let you introduce the type named `a` as yet another function argument:



    λ(a : *) → λ(x : a) → x



This is called "type abstraction". Here the `*` is the "type of types" and is a universal constant that is always in scope, so we can always introduce new types as function arguments this way.

The above function is the "polymorphic identity function", meaning that this is the typed version of the identity function that still preserves the ability to operate on any type.

If we had built-in types like `Int` we could apply our polymorphic function to the type just like any other argument, giving back an identity function for a specific type:



    (λ(a : *) → λ(x : a) → x) Int

    -- β-reduction
    λ(x : Int) → x



This is called "type application" or (more commonly) "specialization". A "polymorphic" function is a function that takes a type as a function argument and we "specialize" a polymorphic function by applying the function to a specific type argument.

However, we are forgoing built-in types like `Int`, so what other types do we have at our disposal?

Well, every lambda expression has a corresponding type. For example, the type of our polymorphic identity function is:



    ∀(a : *) → ∀(x : a) → a



You can read the type as saying:

*   this is a function of two arguments, one argument per "forall" (∀) symbol
*   the first argument is named `a` and `a` is a type
*   the second argument is named `x` and the type of `x` is `a`
*   the result of the function must be a value of type `a`

This type uniquely determines the function's implementation. To be totally pedantic, there is exactly one implementation up to [extensional equality of functions](https://en.wikipedia.org/wiki/Extensionality). Since this function has to work for any possible type `a` there is only one way to implement the function. We must return `x` as the result, since `x` is the only value available of type `a`.

Passing around types as values and function arguments might seem a bit strange to most programmers since most languages either:

*   do not use types at all

    Example: Javascript

    

        // The polymorphic identity function in Javascript
        function id(x) {
            return x
        }

        // Example use of the function
        id(true)

    

*   do use types, but they hide type abstraction and type application from the programmer through the use of "type inference"

    Example: Haskell

    

        -- The polymorphic identity function in Haskell
        id x = x

        -- Example use of the function
        id True

    

*   they use a different syntax for type abstraction/application versus ordinary abstraction and application

    Example: Scala

    

        -- The polymorphic identity function in Scala
        def id[A](x : a)

        -- Example use of the function
        -- Note: Scala lets you omit the `[Boolean]` here thanks
        --       to type inference but I'm making the type
        --       application explicit just to illustrate that
        --       the syntax is different from normal function
        --       application
        id[Boolean](true)

    

For the purpose of this post we will program with _explicit_ type abstraction and type application so that there is no magic or hidden machinery.

So, for example, suppose that we wanted to apply the typed, polymorphic identity function to itself. The untyped version was this:



    (λx → x) (λy → y)



... and the typed version is this:



    (λ(a : *) → λ(x : a) → x)
        (∀(b : *) → ∀(y : b) → b)
        (λ(b : *) → λ(y : b) → y)

    -- β-reduction
    = (λ(x : ∀(b : *) → ∀(y : b) → b) → x)
          (λ(b : *) → λ(y : b) → y)

    -- β-reduction
    = (λ(b : *) → λ(y : b) → y)



So we can still apply the identity function to itself, but it's much more verbose. Languages with type inference automate this sort of tedious work for you while still giving you the safety guarantees of types. For example, in Haskell you would just write:



    (\x -> x) (\y -> y)



... and the compiler would figure out all the type abstractions and type applications for you.

**Exercise:** Haskell provides a `const` function defined like this:



    const :: a -> b -> a
    const x y = x



Translate `const` function to a typed and polymorphic lambda expression in System F (i.e. using explicit type abstractions)

#### Boolean values

Lambda expressions are the "code", so now we need to create "data" from "code".

One of the simplest pieces of data is a boolean value, which we can encode using typed lambda expressions. For example, here is how you implement the value `True`:



    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True



Note that the names have no significance at all. I could have equally well written the expression as:



    λ(a : *) → λ(x : a) → λ(y : a) → x



... which is "α-equivalent" to the previous version (i.e. equivalent up to renaming of variables).

We will save the above expression to a file named `./True` in our current directory. We'll see why shortly.

We can either save the expression using Unicode characters:



    $ cat > ./True
    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True
    <Ctrl-D>



... or using ASCII, replacing each lambda (i.e. `λ`) with a backslash (i.e. `\`) and replacing each arrow (i.e. `→`) with an ASCII arrow (i.e. `->`)



    $ cat > ./True
    \(Bool : *) -> \(True : Bool) -> \(False : Bool) -> True
    <Ctrl-D>



... whichever you prefer. For the rest of this tutorial I will use Unicode since it's easier to read.

Similarly, we can encode `False` by just changing our lambda expression to return the third argument named `False` instead of the second argument named `True`. We'll name this file `./False`:



    $ cat > ./False
    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False
    <Ctrl-D>



What's the type of a boolean value? Well, both the `./True` and `./False` files have the same type, which we shall call `./Bool`:



    $ cat > ./Bool
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool



... and if you are following along with ASCII you can replace each forall symbol (i.e. `∀`) with the word `forall`:



    $ cat > ./Bool
    forall (Bool : *) -> forall (True : Bool) -> forall (False : Bool) -> Bool



We are saving these terms and types to files because we can use the `annah` compiler to work with any lambda expression or type saved as a file. For example, I can use the `annah` compiler to verify that the file `./True` has type `./Bool`:



    $ annah
    -- Read this as: "./True has type ./Bool"
    ./True : ./Bool
    <Ctrl-D>
    ./True
    $ echo $?
    0



If the expression type-checks then `annah` will just compile the expression to lambda calculus (by removing the unnecessary type annotation in this case) and return a zero exit code. However, if the expression does not type-check:



    $ annah
    ./True : ./True
    annah: 
    Expression: ∀(x : λ(Bool : *) → λ(True : Bool) → λ(False : Bool)
    → True) → λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True

    Error: Invalid input type

    Type: λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True

    $ echo $?
    1



... then `annah` will throw an exception and return a non-zero exit code. In this case `annah` complains that the `./True` on the right-hand side of the type annotation is not a valid type.

The last thing we need is a function that can consume values of type `./Bool`, like an `./if` function:



    $ cat > ./if
    λ(x : ./Bool ) → x
    --          ^
    --          |
    --          +-- Note the space.  Filenames must end with a space



The definition of `./if` is blindingly simple: `./if` is just the identity function on `./Bool`s!

To see why this works, let's see what the type of `./if` is. We can ask for the type of any expression by feeding the expression to the `morte` compiler via standard input:



    $ morte < ./if
    ∀(x : ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool) →
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(x : ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool) → x



`morte` is a lambda calculus compiler installed alongside `annah` and `annah` is a higher-level interface to the `morte` language. By default, the `morte` compiler will:

*   resolve all file references (transitively, if necessary)
*   type-check the expression
*   optimize the expression
*   write the expression's type to standard error as the first line of output
*   write the optimized expression to standard output as the last line of output

In this case we only cared about the type, so we could have equally well just asked the `morte` compiler to resolve and infer the type of the expression:



    $ morte resolve < ./Bool/if | morte typecheck
    ∀(x : ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool) →
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool



The above type is the same thing as:



    ∀(x : ./Bool ) → ./Bool



If you don't believe me you can prove this to yourself by asking `morte` to resolve the type:



    $ echo "∀(x : ./Bool ) → ./Bool" | morte resolve
    ∀(x : ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool) →
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool



However, the type will make the most sense if you only expand out the second `./Bool` in the type but leave the first `./Bool` alone:



    ./Bool → ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool



You can read this type as saying that the `./if` function takes four arguments:

*   the first argument is the `./Bool` that we want to branch on (i.e. `./True` or `./False`)
*   the second argument is the result type of our `./if` expression
*   the third argument is the result we return if the `./Bool` evaluates to `./True` (i.e. the "then" branch)
*   the fourth argument is the result we return if the `./Bool` evaluates to `./False` (i.e. the "else" branch)

For example, this Haskell code:



    if True
    then False
    else True



... would translate to this Annah code:



    $ annah
    ./if ./True
        ./Bool   -- The type of the result
        ./False  -- The `then` branch
        ./True   -- The `else` branch
    <Ctrl-D>
    ./if  ./True  ./Bool  ./False  ./True



`annah` does not evaluate the expression. `annah` only translates the expression into Morte code (and the expression is already valid Morte code) and type-checks the expression. If you want to evaluate the expression you need to run the expression through the `morte` compiler, too:



    $ morte
    ./if ./True
        ./Bool   -- The type of the result
        ./False  -- The `then` branch
        ./True   -- The `else` branch
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False



`morte` deduces that the expression has type `./Bool` and the expression evaluates to `./False`.

`morte` evaluates the expression by resolving all references and repeatedly applying β-reduction. This is what happens under the hood:



    ./if
        ./True
        ./Bool
        ./False
        ./True

    -- Resolve the `./if` reference
    = (λ(x : ./Bool ) → x)
        ./True
        ./Bool
        ./False
        ./True

    -- β-reduce
    = ./True
        ./Bool
        ./False
        ./True

    -- Resolve the `./True` reference
    = (λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True)
        ./Bool
        ./False
        ./True

    -- β-reduce
    = (λ(True : ./Bool ) → λ(False : ./Bool ) → True)
        ./False
        ./True

    -- β-reduce
    = (λ(False : ./Bool ) → ./False )
        ./True

    -- β-reduce
    = ./False

    -- Resolve the `./False` reference
    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False



The above sequence of steps is a white lie: the true order of steps is actually different, but equivalent.

The `./if` function was not even necessary because every value of type `./Bool` is already a "pre-formed if expression". That's why `./if` is just the identity function on `./Bool`s. You can delete the `./if` from the above example and the code will still work.

Now let's define the `not` function and save the function to a file:



    $ annah > ./not
    λ(b : ./Bool ) →
        ./if b
            ./Bool
            ./False  -- If `b` is `./True`  then return `./False`
            ./True   -- If `b` is `./False` then return `./True`
    <Ctrl-D>



We can now use this file like an ordinary function:



    $ morte
    ./not ./False
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True
    $ morte
    ./not ./True
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False



Notice how `./not ./False` returns `./True` and `./not ./True` returns `./False`.

Similarly, we can define an `and` function and an `or` function:



    $ annah > and
    λ(x : ./Bool ) → λ(y : ./Bool ) →
        ./if x
            ./Bool
            y        -- If `x` is `./True`  then return `y`
            ./False  -- If `x` is `./False` then return `./False`
    <Ctrl-D>





    $ annah > or
    λ(x : ./Bool ) → λ(y : ./Bool ) →
        ./if x
            ./Bool
            ./True   -- If `x` is `./True`  then return `./True`
            y        -- If `x` is `./False` then return `y`
    <Ctrl-D>



... and use them:



    $ morte
    ./and ./True ./False
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False





    $ morte
    ./or ./True ./False
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True



We started with nothing but lambda expressions, but still managed to implement:

*   a `./Bool` type
*   a `./True` value of type `./Bool`
*   a `./False` value of type `./Bool`
*   `./if`, `./not`, `./and`, and `./or` functions

... and we can do real computation with them! In other words, we've modeled boolean data types entirely as code.

**Exercise:** Implement an `xor` function

#### Natural numbers

You might wonder what other data types you can implement in terms of lambda calculus. Fortunately, you don't have to wonder because the `annah` compiler will actually compile data type definitions to lambda expressions for you.

For example, suppose we want to define a natural number type encoded using Peano numerals. We can write:



    $ annah types
    type Nat
    data Succ (pred : Nat)
    data Zero
    fold foldNat
    <Ctrl-D>



You can read the above datatype specification as saying:

*   Define a type named `Nat` ...
*   ... with a constructor named `Succ` with one field named `pred` of type `Nat` ...
*   ... with another constructor named `Zero` with no fields
*   ... and a fold named `foldNat`

`annah` then translates the datatype specification into the following files and directories:

    +-- ./Nat.annah -- `annah` implementation of `Nat`
    |
    `-- ./Nat
        |
        +-- @  -- `morte` implementation of `Nat`
        |      --
        |      -- If you import the `./Nat` directory this file is
        |      -- imported instead
        |
        +-- Zero.annah     -- `annah` implementation of `Zero`
        |
        +-- Zero           -- `morte` implementation of `Zero`
        |
        +-- Succ.annah     -- `annah` implementation of `Succ`
        |
        +-- Succ           -- `morte` implementation of `Succ`
        |
        +-- foldNat.annah  -- `annah` implementation of `foldNat`
        |
        `-- foldNat        -- `morte` implementation of `foldNat`

Let's see how the `Nat` type is implemented:



    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat



All Boehm-Berarducci-encoded datatypes are encoded as substitution functions, including `./Nat`. Any value of `./Nat` is a function that takes three arguments that we will substitute into our natural number expression:

*   The first argument replace every occurrence of the `Nat` type
*   The second argument replaces every occurrence of the `Succ` constructor
*   The third argument replaces every occurrence of the `Zero` constructor

This will make more sense if we walk through a specific example. First, we will build the number 3 using the `./Nat/Succ` and `./Nat/Zero` constructors:



    $ morte
    ./Nat/Succ (./Nat/Succ (./Nat/Succ ./Nat/Zero ))
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ Zero))



Now suppose that we want to compute whether or not our natural number is `even`. The only catch is that we must limit ourselves to substitution when computing `even`. We have to figure out something that we can substitute in place of the `Succ` constructors and something that we can substitute in place of the `Zero` constructors that will then evaluate to `./True` if the natural number is `even` and `./False` otherwise.

One substitution that works is the following:

*   Replace every `Zero` with `./True` (because `Zero` is `even`)
*   Replace every `Succ` with `./not` (because `Succ` alternates between `even` and `odd`)

So in other words, if we began with this:

    ./Nat/Succ (./Nat/Succ (./Nat/Succ ./Nat/Zero ))

... and we substitute with `./Nat/Succ` with `./not` and substitute `./Nat/Zero` with `./True`:

    ./not (./not (./not ./True ))

... then the expression will reduce to `./False`.

Let's prove this by saving the above number to a file named `./three`:

    $ morte > ./three
    ./Nat/Succ (./Nat/Succ (./Nat/Succ ./Nat/Zero ))
    $ cat three
    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ Zero))

The first thing we need to do is to replace the `Nat` with `./Bool`:



    ./three ./Bool

    -- Resolve `./three`
    = (λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
          Succ (Succ (Succ Zero))
      ) ./Bool

    -- β-reduce
    = λ(Succ : ∀(pred : ./Bool ) → ./Bool ) → λ(Zero : ./Bool ) →
          Succ (Succ (Succ Zero))



Now the next two arguments have exactly the right type for us to substitute in `./not` and `./True`. The argument named `./Succ` is now a function of type `∀(pred : ./Bool ) → ./Bool`, which is the same type as `./not`. The argument named `Zero` is now a value of type `./Bool`, which is the same type as `./True`. This means that we can proceed with the next two arguments:



    ./three ./Bool ./not ./True

    -- Resolve `./three`
    = (λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
          Succ (Succ (Succ Zero))
      ) ./Bool ./not ./True

    -- β-reduce
    = (λ(Succ : ∀(pred : ./Bool ) → ./Bool ) → λ(Zero : ./Bool ) →
          Succ (Succ (Succ Zero))
      ) ./not ./True

    -- β-reduce
    = (λ(Zero : ./Bool ) → ./not (./not (./not Zero))) ./True

    -- β-reduce
    = ./not (./not (./not ./True )))



The result is exactly what we would have gotten if we took our original expression:



    ./Nat/Succ (./Nat/Succ (./Nat/Succ ./Nat/Zero ))



... and replaced `./Nat/Succ` with `./not` and replaced `./Nat/Zero` with `./True`.

Let's verify that this works by running the code through the `morte` compiler:



    $ morte
    ./three ./Bool ./not ./True
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False



`morte` computes that the number `./three` is not even, returning `./False`.

We can even go a step further and save an `./even` function to a file:



    $ annah > even
    \(n : ./Nat ) →
        n ./Bool
            ./not   -- Replace each `./Nat/Succ` with `./not`
            ./True  -- Replace each `./Nat/Zero` with `./True`



... and use our newly-formed `./even` function:



    $ morte
    ./even ./three
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False





    $ morte
    ./even ./Nat/Zero
    <Ctrl-D>
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True



The `annah` compiler actually provides direct support for natural number literals, so you can also just write:



    $ annah | morte
    ./even 100
    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True



What about addition? How do we add two numbers using only substitution?

Well, one way we can add two numbers, `m` and `n`, is that we substitute each `./Nat/Succ` in `m` with `./Nat/Succ` (i.e. keep them the same) and substitute the `Zero` with `n`. In other words:



    $ annah > plus
    λ(m : ./Nat ) → λ(n : ./Nat ) →
        m ./Nat         -- The result will still be a `./Nat`
            ./Nat/Succ  -- Replace each `./Nat/Succ` with `./Nat/Succ`
            n           -- Replace each `./Nat/Zero` with `n`



Let's verify that this works:



    $ annah | morte
    ./plus 2 2
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ Zero)))



We get back a Church-encoded 4!

What happened under the hood was the following substitutions:



    ./plus 2 2

    -- Resolve `./plus`
    = (λ(m : ./Nat ) → λ(n : ./Nat ) → m ./Nat ./Nat/Succ n) 2 2

    -- β-reduce
    = (λ(n : ./Nat ) → 2 ./Nat ./Nat/Succ n) 2

    -- β-reduce
    = 2 ./Nat ./Nat/Succ 2

    -- Definition of 2
    = (./Nat/Succ (./Nat/Succ ./Nat/Zero )) ./Nat ./Nat/Succ 2

    -- Resolve and β-reduce the definition of 2 (multiple steps)
    = (λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
          Succ (Succ Zero)
      ) ./Nat ./Nat/Succ 2

    -- β-reduce
    = (λ(Succ : ∀(pred : ./Nat ) → ./Nat ) → λ(Zero : ./Nat ) →
          Succ (Succ Zero)
      ) ./Nat/Succ 2

    -- β-reduce
    = (λ(Zero : ./Nat ) → ./Nat/Succ (./Nat/Succ Zero)) 2

    -- β-reduce
    = ./Nat/Succ (./Nat/Succ 2)

    -- Definition of 2
    = ./Nat/Succ (./Nat/Succ (./Nat/Succ (./Nat/Succ ./Nat/Zero )))

    -- Resolve and β-reduce (multiple steps)
    = λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
          Succ (Succ (Succ (Succ Zero)))



So we can encode natural numbers in lambda calculus, albeit very inefficiently! There are some tricks that we can use to greatly speed up both the time complexity and constant factors, but it will never be competitive with machine arithmetic. This is more of a proof of concept that you can model arithmetic purely in code.

**Exercise:** Implement a function which multiplies two natural numbers

#### Data types

`annah` also lets you define "temporary" data types that scope over a given expression. In fact, that's how `Nat` was implemented. You can look at the corresponding `*.annah` files to see how each type and term is defined in `annah` before conversion to `morte` code.

For example, here is how the `Nat` type is defined in `annah`:



    $ cat Nat.annah
    type Nat
    data Succ (pred : Nat)
    data Zero
    fold foldNat
    in   Nat



The first four lines are identical to what we wrote when we invoked the `annah types` command from the command line. We can use the exact same data type specification to create a scoped expression that can reference the type and data constructors we specified.

When we run this expression through `annah` we get back the `Nat` type:



    $ annah < Nat.annah
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat



You can use these scoped datatype declarations to quickly check how various datatypes are encoded without polluting your current working directory. For example, I can ask `annah` how the type `Maybe` is encoded in lambda calculus:



    $ annah
    λ(a : *) →
        type Maybe
        data Just (x : a)
        data Nothing
        -- You can also leave out this `fold` if you don't use it
        fold foldMaybe
        in   Maybe
    <Ctrl-D>
    λ(a : *) → ∀(Maybe : *) → ∀(Just : ∀(x : a) → Maybe) →
    ∀(Nothing : Maybe) → Maybe



A `Maybe` value is just another substitution function. You provide one branch that you substitute for `Just` and another branch that you substitute for `Nothing`. For example, the `Just` constructor always substitutes in the first branch and ignores the `Nothing` branch that you supply:



    $ annah
    λ(a : *) →
        type Maybe
        data Just (x : a)
        data Nothing
        in   Just
    <Ctrl-D>
    λ(a : *) → λ(x : a) → λ(Maybe : *) → λ(Just : ∀(x : a) → Maybe)
    → λ(Nothing : Maybe) → Just x



Vice versa, the `Nothing` constructor substitutes in the `Nothing` branch that you supply and ignores the `Just` branch:



    $ annah
    λ(a : *) →  
        type Maybe
        data Just (x : a)
        data Nothing
        in   Nothing
    <Ctrl-D>
    λ(a : *) → λ(Maybe : *) → λ(Just : ∀(x : a) → Maybe) → λ(Nothing : Maybe) → Nothing



Notice how we've implemented `Maybe` and `Just` purely using functions. This implies that any language with functions can encode `Maybe`, like Python!

Let's translate the above definition of `Just` and `Nothing` to the equivalent Python code. The only difference is that we delete the type abstractions because they are not necessary in Python:



    def just(x):
      def f(just, nothing):
        return just(x)
      return f

    def nothing():
      def f(just, nothing):
        return nothing
      return f



We can similarly translate Haskell-style pattern matching like this:



    example :: Maybe Int -> IO ()
    example m = case m of
        Just n  -> print n
        Nothing -> return ()



... into this Python code:



    def example(m):
      def just(n):    # This is what we substitute in place of `Just`
        print(n)
      def nothing():  # This is what we substitute in place of `Nothing`
        return
      m(just, nothing)



... and verify that our pattern matching function works:



    >>> example(nothing())
    >>> example(just(1))
    1



Neat! This means that any algebraic data type can be embedded into any language with functions, which is basically every language!

_Warning: your colleagues may get angry at you if you do this! Consider using a language with built-in support for algebraic data types instead of trying to twist your language into something it's not._

#### Let expressions

You can also translate `let` expressions to lambda calculus, too. For example, instead of saving something to a file we can just use a `let` expression to temporarily define something within a program.

For example, we could write:



    $ annah | morte
    let x : ./Nat = ./plus 1 2
    in  ./plus x x
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ (Succ (Succ Zero)))))



... but that doesn't really tell us anything about how `annah` desugars `let` because we only see the final evaluated result. We can ask `annah` to desugar without performing any other transformations using the `annah desugar` command:



    $ annah desugar
    let x : ./Nat = ./plus 1 2
    in  ./plus x x
    <Ctrl-D>
    (λ(x : ./Nat ) → ./plus  x x) (./plus  (λ(Nat : *) → λ(Succ :
    ∀(pred : Nat) → Nat) → λ(Zero : Nat) → Succ Zero) (λ(Nat : *) →
    λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) → Succ (Succ
    Zero)))



... which makes more sense if we clean up the result through the use of numeric literals:



    (λ(x : ./Nat ) → ./plus x x) (./plus 1 2)



Every time we write an expression of the form:



    let x : t = y
    in  e



... we decode that to lambda calculus as:



    (λ(x : t) → e) y



We can also decode function definitions, too. For example, you can write:



    $ annah | morte
    let increment (x : ./Nat ) : ./Nat = ./plus x 1
    in  increment 3
    <Ctrl-D>
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ Zero)))



... and the intermediate desugared form also encodes the function definition as a lambda expression:



    $ annah desugar
    let increment (x : ./Nat ) : ./Nat = ./plus x 1
    in  increment 3
    <Ctrl-D>
    (λ(increment : ∀(x : ./Nat ) → ./Nat ) → increment (λ(Nat : *)
    → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) → Succ (Succ
    (Succ Zero)))) (λ(x : ./Nat ) → ./plus  x (λ(Nat : *) → λ(Succ
    : ∀(pred : Nat) → Nat) → λ(Zero : Nat) → Succ Zero)



... which you can clean up as this expression:



    (λ(increment : ∀(x : ./Nat ) → ./Nat ) → increment 3)
        (λ(x : ./Nat ) → ./plus x 1)



We can combine `let` expressions with data type expressions, too. For example, here's our original `not` program, except without saving anything to files:



    $ annah
    type Bool
    data True
    data False
    fold if
    in

    let not (b : Bool) : Bool = if b Bool False True
    in

    not False
    <Ctrl-D>
    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → True



#### Lists

`annah` also provides syntactic support for lists as well. For example:



    $ annah
    [nil ./Bool , ./True , ./False , ./True ]
    <Ctrl-D>
    λ(List : *) → λ(Cons : ∀(head : ./Bool ) → ∀(tail : List) →
    List) → λ(Nil : List) → Cons ./True  (Cons ./False  (Cons
    ./True  Nil))



Just like all the other data types, a list is defined in terms of what you use to substitute each `Cons` and `Nil` constructor. I can replace each `Cons` with `./and` and the `Nil` with `./True` like this:



    $ annah | morte
    <Ctrl-D>
    [nil ./Bool , ./True , ./False , ./True ] ./Bool ./and ./True

    ∀(Bool : *) → ∀(True : Bool) → ∀(False : Bool) → Bool

    λ(Bool : *) → λ(True : Bool) → λ(False : Bool) → False



This conceptually followed the following reduction sequence:

    (   λ(List : *)
    →   λ(Cons : ∀(head : ./Bool ) → ∀(tail : List) → List)
    →   λ(Nil : List)
    →   Cons ./True  (Cons ./False  (Cons ./True  Nil))
    )   ./Bool
        ./and
        ./True

    -- β-reduction
    = (   λ(Cons : ∀(head : ./Bool ) → ∀(tail : ./Bool ) → ./Bool )
      →   λ(Nil : ./Bool )
      →   Cons ./True  (Cons ./False  (Cons ./True  Nil))
      )   ./and
          ./True

    -- β-reduction
    = (   λ(Nil : ./Bool )
      →   ./and ./True  (./and ./False  (./and ./True  Nil))
      )   ./True

    -- β-reduction
    = ./and ./True (./and ./False (./and ./True ./True))

Similarly, we can sum a list by replacing each `Cons` with `./plus` and replacing each `Nil` with `0`:



    $ annah | morte
    [nil ./Nat , 1, 2, 3, 4] ./Nat ./plus 0
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    Zero)))))))))



This behaves as if we had written:



    ./plus 1 (./plus 2 (./plus 3 (./plus 4 0)))



#### Prelude

`annah` also comes with a Prelude to show some more sophisticated examples of what you can encode in pure lambda calculus. You can find version 1.0 of the Prelude here:

[http://sigil.place/prelude/annah/1.0/](http://sigil.place/prelude/annah/1.0/)

You can use these expressions directly within your code just by referencing their URL. For example, the remote `Bool` expression is located here:

[http://sigil.place/prelude/annah/1.0/Bool/@](http://sigil.place/prelude/annah/1.0/Bool/@)

... and the remote `True` expression is located here:

[http://sigil.place/prelude/annah/1.0/Bool/True](http://sigil.place/prelude/annah/1.0/Bool/True)

... so we can check if the remote `True`'s type matches the remote `Bool` by writing this:



    $ annah
    http://sigil.place/prelude/annah/1.0/Bool/True : http://sigil.place/prelude/annah/1.0/Bool
    <Ctrl-D>
    http://sigil.place/prelude/annah/1.0/Bool/True 
    $ echo $?
    0



Similarly, we can build a natural number (very verbosely) using remote `Succ` and `Zero`:



    $ annah | morte
    http://sigil.place/prelude/annah/1.0/Nat/Succ
    (   http://sigil.place/prelude/annah/1.0/Nat/Succ
        (   http://sigil.place/prelude/annah/1.0/Nat/Succ
            http://sigil.place/prelude/annah/1.0/Nat/Zero
        )
    )
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ Zero))



However, we can also locally clone the Prelude using `wget` if we wish to refer to local file paths instead of remote paths:



    $ wget -np -r --cut-dirs=3 http://sigil.place/prelude/annah/1.0/
    $ cd sigil.place
    $ ls
    (->)            Defer.annah    List.annah    Path         Sum0.annah
    (->).annah      Eq             Maybe         Path.annah   Sum1
    Bool            Eq.annah       Maybe.annah   Prod0        Sum1.annah
    Bool.annah      Functor        Monad         Prod0.annah  Sum2
    Category        Functor.annah  Monad.annah   Prod1        Sum2.annah
    Category.annah  index.html     Monoid        Prod1.annah
    Cmd             IO             Monoid.annah  Prod2
    Cmd.annah       IO.annah       Nat           Prod2.annah
    Defer           List           Nat.annah     Sum0



Now we can use these expressions using their more succinct local paths:



    ./Nat/sum (./List/(++) ./Nat [nil ./Nat , 1, 2] [nil ./Nat , 3, 4])
    <Ctrl-D>
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    Zero)))))))))



Also, every expression has a corresponding `*.annah` file that documents the expression's type using a `let` expression. For example, we can see the type of the `./List/(++)` function by studying the `./List/(++).annah` file:



    cat './List/(++).annah' 
    let (++) (a : *) (as1 : ../List a) (as2 : ../List a) : ../List a =
            \(List : *)
        ->  \(Cons : a -> List -> List)
        ->  \(Nil : List)
        ->  as1 List Cons (as2 List Cons Nil)
    in (++)



The top line tells us that `(++)` is a function that takes three arguments:

*   An argument named `a` for the type list elements you want to combine
*   An argument named `as1` for the left list you want to combine
*   An argument named `as2` for the right list you want to combine

... and the function returns a list of the same type as the two input lists.

#### Beyond

Exactly how far can you take lambda calculus? Well, here's a program written in `annah` that reads two natural numbers, adds them, and writes them out:



    $ annah | morte
    ./IO/Monad ./Prod0 (do ./IO {
        x : ./Nat   <- ./IO/get ;
        y : ./Nat   <- ./IO/get ;
        _ : ./Prod0 <- ./IO/put (./Nat/(+) x y);
    })
    ∀(IO : *) → ∀(Get_ : ((∀(Nat : *) → ∀(Succ : ∀(pred : Nat) →
    Nat) → ∀(Zero : Nat) → Nat) → IO) → IO) → ∀(Put_ : (∀(Nat : *)
    → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat) → IO →
    IO) → ∀(Pure_ : (∀(Prod0 : *) → ∀(Make : Prod0) → Prod0) → IO)
    → IO

    λ(IO : *) → λ(Get_ : ((∀(Nat : *) → ∀(Succ : ∀(pred : Nat) →
    Nat) → ∀(Zero : Nat) → Nat) → IO) → IO) → λ(Put_ : (∀(Nat : *)
    → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat) → IO →
    IO) → λ(Pure_ : (∀(Prod0 : *) → ∀(Make : Prod0) → Prod0) → IO)
    → Get_ (λ(r : ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) →
    ∀(Zero : Nat) → Nat) → Get_ (λ(r : ∀(Nat : *) → ∀(Succ :
    ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat) → Put_ (λ(Nat : *)
    → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) → r@1 Nat Succ
    (r Nat Succ Zero)) (Pure_ (λ(Prod0 : *) → λ(Make : Prod0) →
    Make))))



This does not run the program, but it creates a syntax tree representing all program instructions and the flow of information.

`annah` supports `do` notation so you can do things like write list comprehensions in `annah`:



    $ annah | morte
    ./List/sum (./List/Monad ./Nat (do ./List {
        x : ./Nat <- [nil ./Nat , 1, 2, 3];
        y : ./Nat <- [nil ./Nat , 4, 5, 6];
        _ : ./Nat <- ./List/pure ./Nat (./Nat/(+) x y);
    }))
    <Ctrl-D>
    ∀(Nat : *) → ∀(Succ : ∀(pred : Nat) → Nat) → ∀(Zero : Nat) → Nat

    λ(Nat : *) → λ(Succ : ∀(pred : Nat) → Nat) → λ(Zero : Nat) →
    Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ (Succ
    (Succ (Succ (Succ Zero)))))))))))))))))))))))))))))))))))))))))
    )))))))))))))))))))))



The above Annah program is equivalent to the following Haskell program:



    sum (do
        x <- [1, 2, 3]
        y <- [4, 5, 6]
        return (x + y) )



... yet it is implemented 100% in a minimal and total lambda calculus without any built-in support for data types.

This tutorial doesn't cover how `do` notation works, but you can learn this and more by reading the Annah tutorial which is bundled with the Hackage package:

*   [Annah tutorial](http://hackage.haskell.org/package/annah/docs/Annah-Tutorial.html)

#### Conclusions

A lot of people underestimate how much you can do in a total lambda calculus. I don't recommend pure lambda calculus as a general programming language, but I could see a lambda calculus enriched with high-efficiency primitives to be a realistic starting point for simple functional languages that are easy to port and distribute.

One of the projects I'm working towards in the long run is a "JSON for code" and `annah` is one step along the way towards that goal. `annah` will likely not be that language, but I still factored out `annah` as a separate and reusable project along the way so that others could fork and experiment with `annah` when experimenting with their own language design.

Also, as far as I can tell `annah` is the only project in the wild that actually implements the Boehm-Berarducci encoding outlined in this paper:

*   [Automatic synthesis of typed Λ-programs on term algebras](http://www.sciencedirect.com/science/article/pii/0304397585901355)

... so if you prefer to learn the encoding algorithm by studying actual code you can use the `annah` source code as a reference real-world implementation.

You can find Annah project on Hackage or Github:

... and you can find the Annah prelude hosted online:

*   [Annah Prelude](http://sigil.place/prelude/annah/1.0/)

The Annah tutorial goes into the Annah language and compiler in much more detail than this tutorial, so if you would like to learn more I highly recommend reading the tutorial which walks through the compiler, desugaring, and the Prelude in much more detail:

*   [Annah tutorial](http://hackage.haskell.org/package/annah/docs/Annah-Tutorial.html)

Also, for those who are curious, both the `annah` and `morte` compilers are named after characters from the game Planescape: Torment.
