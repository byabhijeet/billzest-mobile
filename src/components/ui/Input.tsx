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

export interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  secureToggle?: boolean;
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
    ...rest
  } = props;
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const hasError = Boolean(error);
  const [isSecure, setIsSecure] = React.useState<boolean>(
    Boolean(secureTextEntry),
  );

  React.useEffect(() => {
    setIsSecure(Boolean(secureTextEntry));
  }, [secureTextEntry]);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          placeholderTextColor={tokens.mutedForeground}
          style={[
            styles.input,
            secureToggle && styles.inputWithAccessory,
            hasError && { borderColor: tokens.destructive },
            style,
          ]}
          secureTextEntry={isSecure}
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
    inputWrapper: {
      position: 'relative',
      justifyContent: 'center',
    },
    inputWithAccessory: {
      paddingRight: 44,
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
