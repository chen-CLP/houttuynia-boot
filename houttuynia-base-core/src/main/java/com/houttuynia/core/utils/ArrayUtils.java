package com.houttuynia.core.utils;

import java.util.List;
import java.util.Objects;

/**
 * ArrayUtils
 *
 * @author clp
 * @date 2023-8-14 16:01
 */
public final class ArrayUtils {
    public static Boolean isNotEmpty(List list) {
        return Objects.nonNull(list) && !list.isEmpty();
    }
}
