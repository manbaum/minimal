package com.bocsoft.bfw.queue.tools;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * Class CollectionMapper.
 * <p>
 *
 * @author manbaum
 * @since Jan 09, 2019
 */
public final class CollectionMapper {

    private CollectionMapper() {
    }

    public static <T, R> R foldLeft(Iterator<T> src, BiFunction<R, T, R> function, R initValue) {
        R result = initValue;
        while (src.hasNext()) {
            result = function.apply(result, src.next());
        }
        return result;
    }

    public static <T, R> R foldRight(Iterator<T> src, BiFunction<T, R, R> function, R initValue) {
        final ArrayList<T> list = new ArrayList<>();
        src.forEachRemaining(list::add);
        return foldRight(list, function, initValue);
    }

    public static <T, R> List<R> map(List<T> src, Function<T, R> function) {
        final int n = src.size();
        final ArrayList<R> result = new ArrayList<>(n);
        for (T t : src) {
            result.add(function.apply(t));
        }
        return result;
    }

    public static <T, R> List<R> flatMap(List<T> src, Function<T, List<R>> function) {
        final int n = src.size();
        final ArrayList<R> result = new ArrayList<>(n);
        for (T t : src) {
            result.addAll(function.apply(t));
        }
        result.trimToSize();
        return result;
    }

    public static <T, R> R foldLeft(List<T> src, BiFunction<R, T, R> function, R initValue) {
        R result = initValue;
        for (T t : src) {
            result = function.apply(result, t);
        }
        return result;
    }

    public static <T, R> R foldRight(List<T> src, BiFunction<T, R, R> function, R initValue) {
        R result = initValue;
        for (int i = src.size() - 1; i >= 0; i--) {
            result = function.apply(src.get(i), result);
        }
        return result;
    }

    public static <T, R> Set<R> map(Set<T> src, Function<T, R> function) {
        final int n = src.size();
        final HashSet<R> result = new HashSet<>(n);
        for (T t : src) {
            result.add(function.apply(t));
        }
        return result;
    }

    public static <T, R> Set<R> flatMap(Set<T> src, Function<T, Set<R>> function) {
        final int n = src.size();
        final HashSet<R> result = new HashSet<>(n);
        for (T t : src) {
            result.addAll(function.apply(t));
        }
        return result;
    }

    public static <T, R> R foldLeft(Set<T> src, BiFunction<R, T, R> function, R initValue) {
        return foldLeft(src.iterator(), function, initValue);
    }

    public static <T, R> R foldRight(Set<T> src, BiFunction<T, R, R> function, R initValue) {
        return foldRight(src.iterator(), function, initValue);
    }

    public static <KT, KR, V> Map<KR, V> mapKey(Map<KT, V> src, Function<KT, KR> function) {
        final int n = src.size();
        final HashMap<KR, V> result = new HashMap<>(n);
        for (KT kt : src.keySet()) {
            final V value = src.get(kt);
            result.put(function.apply(kt), value);
        }
        return result;
    }

    public static <KT, KR, V> Map<KR, V> flatMapKey(Map<KT, V> src, Function<KT, Set<KR>> function) {
        final int n = src.size();
        final HashMap<KR, V> result = new HashMap<>(n);
        for (KT kt : src.keySet()) {
            final V value = src.get(kt);
            function.apply(kt).forEach(k -> result.put(k, value));
        }
        return result;
    }

    public static <VT, VR, K> Map<K, VR> mapValue(Map<K, VT> src, Function<VT, VR> function) {
        final int n = src.size();
        final HashMap<K, VR> result = new HashMap<>(n);
        for (K k : src.keySet()) {
            final VT value = src.get(k);
            result.put(k, function.apply(value));
        }
        return result;
    }

    public static <KT, KR, VT, VR> Map<KR, VR> mapEntry(Map<KT, VT> src, Function<KT, KR> funKey, Function<VT, VR> funValue) {
        final int n = src.size();
        final HashMap<KR, VR> result = new HashMap<>(n);
        for (KT kt : src.keySet()) {
            final VT value = src.get(kt);
            result.put(funKey.apply(kt), funValue.apply(value));
        }
        return result;
    }

    public static <KT, KR, VT, VR> Map<KR, VR> mapEntry(Map<KT, VT> src, Function<Map.Entry<KT, VT>, Map.Entry<KR, VR>> function) {
        final int n = src.size();
        final HashMap<KR, VR> result = new HashMap<>(n);
        for (Map.Entry<KT, VT> et : src.entrySet()) {
            final Map.Entry<KR, VR> er = function.apply(et);
            result.put(er.getKey(), er.getValue());
        }
        return result;
    }

    public static <KT, KR, VT, VR> Map<KR, VR> flatMapEntry(Map<KT, VT> src, Function<Map.Entry<KT, VT>, Set<Map.Entry<KR, VR>>> function) {
        final int n = src.size();
        final HashMap<KR, VR> result = new HashMap<>(n);
        for (Map.Entry<KT, VT> et : src.entrySet()) {
            function.apply(et).forEach(er -> result.put(er.getKey(), er.getValue()));
        }
        return result;
    }
}
