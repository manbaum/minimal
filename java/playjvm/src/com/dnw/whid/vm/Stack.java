package com.dnw.whid.vm;

import java.lang.reflect.Array;
import java.util.EmptyStackException;
import java.util.Vector;

public final class Stack<E> extends Vector<E> {

    public Stack() {
    }

    @SuppressWarnings("unchecked")
    public synchronized E peek(final int offset) {
        if (offset < 0) {
            throw new IllegalArgumentException("illegal.offset: " + offset);
        }
        if (elementCount == 0) {
            throw new EmptyStackException();
        }
        final int index = elementCount - offset - 1;
        if (index < 0) {
            throw new ArrayIndexOutOfBoundsException("illegal.offset: " + offset + ", size: " + elementCount);
        }
        return (E) elementData[index];
    }

    public E top() {
        return peek(0);
    }

    public synchronized E[] top(final int count, final Class<E> clazz) {
        if (count < 0) {
            throw new IllegalArgumentException("illegal.count: " + count);
        }
        if (clazz == null) {
            throw new NullPointerException("clazz");
        }
        final int fromIndex = elementCount - count;
        if (fromIndex < 0) {
            throw new ArrayIndexOutOfBoundsException("illegal.count: " + count + ", size: " + elementCount);
        }
        @SuppressWarnings("unchecked") final E[] copy = (clazz == Object.class)
                ? (E[]) new Object[count]
                : (E[]) Array.newInstance(clazz, count);
        System.arraycopy(elementData, fromIndex, copy, 0, count);
        return copy;
    }

    public synchronized E pick(final int offset) {
        final E item = peek(offset);
        ensureCapacity(elementCount + 1);
        elementData[elementCount++] = item;
        return item;
    }

    public E dup() {
        return pick(0);
    }

    public E push(final E item) {
        addElement(item);
        return item;
    }

    public synchronized void pushAll(final E... items) {
        final int numNew = items.length;
        if (numNew > 0) {
            ensureCapacity(elementCount + numNew);
            System.arraycopy(items, 0, elementData, elementCount, numNew);
            elementCount += numNew;
        }
    }

    public synchronized E pop() {
        if (elementCount == 0) {
            throw new EmptyStackException();
        }
        modCount++;
        elementCount--;
        @SuppressWarnings("unchecked") final E item = (E) elementData[elementCount];
        elementData[elementCount] = null; /* to let gc do its work */
        return item;
    }

    public synchronized void drop(final int count) {
        if (count <= 0 || elementCount == 0) return;
        modCount++;
        // Let gc do its work
        final int newElementCount = elementCount - count;
        while (elementCount != newElementCount) {
            elementData[--elementCount] = null;
        }
    }

    public synchronized E swap(final int iOffset, final int jOffset) {
        if (iOffset < 0) {
            throw new IllegalArgumentException("illegal.offset: " + iOffset);
        }
        if (jOffset < 0) {
            throw new IllegalArgumentException("illegal.offset: " + jOffset);
        }
        if (elementCount == 0) {
            throw new EmptyStackException();
        }
        final int iIndex = elementCount - iOffset - 1;
        if (iIndex < 0) {
            throw new ArrayIndexOutOfBoundsException("illegal.offset: " + iOffset + ", size: " + elementCount);
        }
        final int jIndex = elementCount - jOffset - 1;
        if (jIndex < 0) {
            throw new ArrayIndexOutOfBoundsException("illegal.offset: " + jOffset + ", size: " + elementCount);
        }
        modCount++;
        @SuppressWarnings("unchecked") final E item = (E) elementData[iIndex];
        if (iIndex != jIndex) {
            elementData[iIndex] = elementData[jIndex];
            elementData[jIndex] = item;
        }
        return item;
    }
}
