import {
  Group,
  Button,
  Burger,
  Select,
  ActionIcon,
  Modal,
  useMantineColorScheme,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings, IconSun, IconSunMoon } from "@tabler/icons-react";

export default function Header({
  margin,
  setMargin,
  toggleNavbar,
  navbarOpen,
}: {
  margin: "xs" | "sm" | "md" | "lg" | "xl";
  setMargin: (margin: "xs" | "sm" | "md" | "lg" | "xl") => void;
  toggleNavbar: () => void;
  navbarOpen: boolean;
}) {
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);

  const { setColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <Group justify="space-between" align="flex-start" style={{ width: "100%" }}>
      <Group style={{ flex: 1 }}>
        <Burger
          opened={navbarOpen}
          onClick={toggleNavbar}
          hiddenFrom="sm"
          size="sm"
        />
      </Group>
      <Group>
        <ActionIcon
          variant="subtle"
          size="md"
          onClick={() =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark")
          }
        >
          {colorScheme === "dark" ? <IconSun /> : <IconSun />}
        </ActionIcon>
        <ActionIcon variant="subtle" size="md" onClick={openSettings}>
          <IconSettings />
        </ActionIcon>
        <Settings
          margin={margin}
          setMargin={setMargin}
          opened={settingsOpened}
          onClose={closeSettings}
        />
      </Group>
    </Group>
  );
}

export function Settings({
  margin,
  setMargin,
  opened,
  onClose,
}: {
  margin: "xs" | "sm" | "md" | "lg" | "xl";
  setMargin: (margin: "xs" | "sm" | "md" | "lg" | "xl") => void;
  opened: boolean;
  onClose: () => void;
}) {
  const marginSizes = ["xs", "sm", "md", "lg", "xl"];
  const marginSizeLabels = {
    xs: "Extra Small",
    sm: "Small",
    md: "Medium",
    lg: "Large",
    xl: "Extra Large",
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Settings"
      size="lg"
      centered
    >
      <Stack>
        <Select
          data={marginSizes.map((size) => ({
            value: size,
            label: marginSizeLabels[size as keyof typeof marginSizeLabels],
          }))}
          label="Margin"
          value={margin}
          onChange={(value) => {
            if (value) {
              setMargin(value as "xs" | "sm" | "md" | "lg" | "xl");
            }
          }}
          placeholder="Select margin size"
        />
      </Stack>
    </Modal>
  );
}
