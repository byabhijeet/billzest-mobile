import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Eye, EyeOff } from 'lucide-react-native';

export type InputVariant = 'outlined' | 'tonal';

export interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  secureToggle?: boolean;
  variant?: InputVariant;
  prefix?: string;
}

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    label,
    hint,
    error,
    containerStyle,
    style,
    secureToggle = false,
    secureTextEntry,
    variant = 'outlined',
    prefix,
    ...rest
  } = props;
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const hasError = Boolean(error);
  const [isSecure, setIsSecure] = React.useState<boolean>(
    Boolean(secureTextEntry),
  );
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setIsSecure(Boolean(secureTextEntry));
  }, [secureTextEntry]);

  const isTonal = variant === 'tonal';

  return (
    <View style={[isTonal && styles.tonalContainer, containerStyle]}>
      {label && (
        <Text style={[styles.label, isTonal && styles.tonalLabel]}>{label}</Text>
      )}
      <View style={[styles.inputWrapper, isTonal && styles.tonalWrapper]}>
        {prefix && (
          <View style={[styles.prefixContainer, isTonal && styles.tonalPrefixContainer]}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={tokens.mutedForeground}
          style={[
            styles.input,
            isTonal && styles.tonalInput,
            isFocused && (isTonal ? styles.tonalFocused : styles.outlinedFocused),
            secureToggle && styles.inputWithAccessory,
            prefix && styles.inputWithPrefix,
            hasError && styles.inputError,
            style,
          ]}
          secureTextEntry={isSecure}
          onFocus={e => { setIsFocused(true); rest.onFocus?.(e); }}
          onBlur={e => { setIsFocused(false); rest.onBlur?.(e); }}
          {...rest}
        />
        {secureToggle && (
          <Pressable
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            style={styles.secureToggle}
            onPress={() => setIsSecure(prev => !prev)}
          >
            {isSecure ? (
              <Eye color={tokens.mutedForeground} size={18} />
            ) : (
              <EyeOff color={tokens.mutedForeground} size={18} />
            )}
          </Pressable>
        )}
      </View>
      {(hint || error) && (
        <Text style={[styles.hint, hasError && { color: tokens.destructive }]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 6,
    },
    tonalLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: tokens.mutedForeground,
      marginBottom: 2,
      marginLeft: 4,
    },
    tonalContainer: {
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: tokens.foreground,
      backgroundColor: tokens.card,
      fontSize: 15,
    },
    tonalInput: {
      borderWidth: 0,
      backgroundColor: tokens.muted,
      fontSize: 14,
      fontWeight: '500',
      minHeight: 44,
      paddingVertical: 10,
    },
    inputWrapper: {
      position: 'relative',
      justifyContent: 'center',
    },
    tonalWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.muted,
      borderRadius: 14,
      overflow: 'hidden',
      minHeight: 44,
    },
    outlinedFocused: {
      borderColor: tokens.ring,
    },
    tonalFocused: {
      borderWidth: 1.5,
      borderColor: tokens.ring,
    },
    inputError: {
      borderWidth: 1,
      borderColor: tokens.destructive,
    },
    inputWithAccessory: {
      paddingRight: 44,
    },
    inputWithPrefix: {
      flex: 1,
      paddingLeft: 4,
    },
    prefixContainer: {
      paddingHorizontal: 12,
      justifyContent: 'center',
      backgroundColor: tokens.secondary,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    tonalPrefixContainer: {
      backgroundColor: tokens.secondary,
    },
    prefixText: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.mutedForeground,
    },
    secureToggle: {
      position: 'absolute',
      right: 12,
      height: '100%',
      justifyContent: 'center',
    },
    hint: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginTop: 6,
    },
  });

export default Input;
