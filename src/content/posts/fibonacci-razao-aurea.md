---
title: "Fibonacci, a razão áurea e o preço de uma recursão ingênua"
description: "Por que a razão entre termos consecutivos de Fibonacci converge para φ, e por que a recursão direta custa exatamente esse mesmo φ elevado a n."
pubDatetime: 2026-09-20T18:00:00-03:00
category: matematica
series: Recorrências
seriesOrder: 1
tags:
  - matematica
  - ruby
  - complexidade
featured: true
---

Poucas sequências carregam tanta mitologia quanto a de Fibonacci. Ela aparece em livros de divulgação, em conchas mal desenhadas e em pelo menos uma entrevista de emprego por semana. Mas por trás do folclore existe um resultado bonito e preciso: a razão entre termos consecutivos converge para o número de ouro, e essa convergência tem uma explicação que cabe em meia página.

A definição é a de sempre: $F_0 = 0$, $F_1 = 1$ e cada termo seguinte é a soma dos dois anteriores, $F_n = F_{n-1} + F_{n-2}$. O que raramente se mostra é que a sequência admite uma forma fechada — a fórmula de Binet[^binet] — obtida ao resolver a equação característica da recorrência:

$$
F_n = \frac{\varphi^n - \psi^n}{\sqrt{5}}, \qquad
\varphi = \frac{1 + \sqrt{5}}{2}, \quad
\psi = \frac{1 - \sqrt{5}}{2}
$$

Como $|\psi| < 1$, o segundo termo morre rapidamente e $F_n$ passa a ser, para todos os efeitos práticos, $\varphi^n / \sqrt{5}$ arredondado ao inteiro mais próximo. É daí que vem a convergência da razão $F_{n+1} / F_n \to \varphi \approx 1{,}618$.

> A matemática não é sobre números, equações ou algoritmos: é sobre entendimento.
>
> — William Paul Thurston

## O custo de fazer do jeito óbvio

A tradução direta da definição para código é um clássico de sala de aula — e um clássico de desempenho ruim. Cada chamada gera outras duas, e o número de chamadas cresce, ironicamente, na mesma taxa $\varphi^n$ que estamos estudando. Memoizar transforma a árvore exponencial em uma linha reta:

```ruby file=fibonacci.rb
# Recursão ingênua: O(φ^n) chamadas
def fib_naive(n)
  return n if n < 2
  fib_naive(n - 1) + fib_naive(n - 2)
end

# Com memoização: O(n) tempo, O(n) espaço
def fib(n, memo = { 0 => 0, 1 => 1 })
  memo[n] ||= fib(n - 1, memo) + fib(n - 2, memo) # [!code highlight]
end

puts fib(90) # => 2880067194370816120
```

O código inline também precisa conviver com a serifa: `memo[n] ||= ...` é a única linha que importa. Em Ruby, o operador `||=` só avalia o lado direito quando a chave ainda não existe, o que é exatamente a definição de memoização.

### O mesmo truque em outras linguagens

Em Python o dicionário vira um decorador da biblioteca padrão:

```python file=fibonacci.py
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(90))  # 2880067194370816120
```

E em TypeScript a versão iterativa dispensa até o cache — bastam duas variáveis:

```ts file=fibonacci.ts
export function fib(n: number): bigint {
  let [previous, current] = [0n, 1n];
  for (let i = 0; i < n; i++) {
    [previous, current] = [current, previous + current];
  }
  return previous;
}

console.log(fib(90)); // 2880067194370816120n
```

## Quanto custa cada abordagem

| Abordagem               | Tempo          | Espaço |     `fib(40)` em Ruby |
| ----------------------- | -------------- | ------ | --------------------: |
| Recursão ingênua        | $O(\varphi^n)$ | $O(n)$ |                ~ 30 s |
| Memoização              | $O(n)$         | $O(n)$ |                < 1 ms |
| Iterativa               | $O(n)$         | $O(1)$ |                < 1 ms |
| Binet (ponto flutuante) | $O(1)$         | $O(1)$ | exato só até $n = 70$ |

Alguns pontos que valem a pena guardar:

- A fórmula de Binet é exata em aritmética real, mas em `Float` de 64 bits ela começa a errar por volta de $n = 71$ — o `2^{53}$ da mantissa não aguenta mais dígitos.
- Toda recorrência linear homogênea tem uma forma fechada do mesmo tipo: raízes da equação característica elevadas a $n$.
- Sempre que uma recursão ramifica, vale perguntar quantos subproblemas _distintos_ existem. Aqui são $n$, não $\varphi^n$.

A lição extrapola Fibonacci: sempre que uma recorrência aparece, vale perguntar se existe forma fechada; e sempre que uma recursão ramifica, vale contar os subproblemas antes de contar as chamadas.

[^binet]: Jacques Philippe Marie Binet publicou a fórmula em 1843, embora Euler, Daniel Bernoulli e de Moivre já a conhecessem um século antes.
